from oracle.connectors.mysql import MySQLConnector
from oracle.errors import ValueNotSupported
import pandas as pd
from oracle.models.dataset_table_column import DatasetTableColumn
import pantab_server.pantab_client as pantab


CONNECTORS = {"mysql": MySQLConnector}


class DatasetTables:
    @staticmethod
    def preview_and_columns(table):
        connector = CONNECTORS[table.connector.lower()]
        with connector().execute(table.query) as cursor:
            columns = cursor.column_names
            rows = cursor.fetchmany(25)

        df = pd.DataFrame(rows, columns=columns)
        return _df_to_html(df), _df_table_columns(df)

    @staticmethod
    def preview_with_column_types(table):
        df = DatasetTables.df_from_query(table.query)
        df = df.astype(_table_dtypes(table), errors="ignore")
        return _df_to_html(df)

    @staticmethod
    def build(file_name, table, limit=100_000):
        connector = CONNECTORS[table.connector.lower()]

        total = 0
        with connector().execute(table.query) as cursor:
            while True:
                rows = cursor.fetchmany(limit)
                if len(rows) == 0:
                    break

                _save(file_name, table, rows, cursor.column_names, replace=total == 0)
                total += len(rows)

        table.total_records = total
        table.save()


def _save(file_name, table, rows, column_names, replace):
    df = pd.DataFrame(rows, columns=column_names)
    df = df.astype(_table_dtypes(table), errors="ignore")
    if replace:
        pantab.replace(df, file_name, table.name)
    else:
        pantab.append(df, file_name, table.name)


def _table_dtypes(table):
    return {column.name: _to_dtype(column.type) for column in table.columns.all()}


def _df_to_html(df):
    return df.to_html(index=False, na_rep="", escape=False)


def _df_dtypes(df):
    return df.dtypes.to_frame("dtypes").reset_index().set_index("index")["dtypes"].astype(str).to_dict()


def _df_table_columns(df):
    cols = []
    for (name, dtype) in _df_dtypes(df).items():
        col = DatasetTableColumn(name=name, type=_from_dtype(dtype))
        cols.append(col)
    return cols


def _from_dtype(dtype):
    dtype = dtype.lower()

    if "object" in dtype:
        return "Text"
    elif "int" in dtype:
        return "Integer"
    elif "float" in dtype:
        return "Float"
    elif "datetime" in dtype:
        return "DateTime"
    else:
        raise ValueNotSupported("Pandas dtype not mapped", dtype)


def _to_dtype(type):
    if "Text" in type:
        return "string"
    elif "Integer" in type:
        # Capital "I" @see https://pandas.pydata.org/docs/user_guide/integer_na.html
        return "Int64"
    elif "Float" in type:
        return "float64"
    elif "DateTime" in type:
        return "datetime64[ns]"
    else:
        raise ValueNotSupported("Column type not mapped", type)
