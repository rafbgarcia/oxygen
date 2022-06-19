from oracle.connectors import MySQLConnector
from oracle.errors import ValueNotSupported
import pandas as pd


class DatasetHelper:
    @classmethod
    def pandas_dtypes_to_fields(klass, dict):
        return [{"name": name, "type": convert_to_user_type(dtype)} for (name, dtype) in dict.items()]

    @classmethod
    def fields_to_pandas_dtype(klass, columns):
        return {column.name: convert_to_pandas_dtype(column.type) for column in columns}

    @classmethod
    def preview(klass, query):
        with MySQLConnector().execute(query) as cursor:
            columns = cursor.column_names
            df = pd.DataFrame(cursor.fetchmany(25), columns=columns)

        dtypes = df.dtypes.to_frame("dtypes").reset_index().set_index("index")["dtypes"].astype(str).to_dict()

        columns = DatasetHelper.pandas_dtypes_to_fields(dtypes)
        preview = df.to_html(index=False, na_rep="", escape=False)
        return columns, preview


def convert_to_user_type(dtype):
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


def convert_to_pandas_dtype(type):
    if "Text" in type:
        return "string"
    elif "Integer" in type:
        return "Int64"  # Capital "I" @see https://pandas.pydata.org/docs/user_guide/integer_na.html
    elif "Float" in type:
        return "float64"
    elif "DateTime" in type:
        return "datetime64[ns]"
    else:
        raise ValueNotSupported("Field type not mapped", type)
