from o2.connectors import MySQLConnector
from o2.errors import ValueNotSupported
import pandas as pd


class DatasetHelper:
    @classmethod
    def pandas_dtypes_to_fields(klass, dict):
        return [{"name": name, "type": convert_to_user_type(dtype)} for (name, dtype) in dict.items()]

    @classmethod
    def fields_to_pandas_dtype(klass, fields):
        return {field["name"]: convert_to_pandas_dtype(field["type"]) for field in fields}

    @classmethod
    def preview(klass, query):
        with MySQLConnector().execute(query) as cursor:
            fields = cursor.column_names
            df = pd.DataFrame(cursor.fetchmany(25), columns=fields)

        dtypes = df.dtypes.to_frame("dtypes").reset_index().set_index("index")["dtypes"].astype(str).to_dict()

        return {
            "fields": DatasetHelper.pandas_dtypes_to_fields(dtypes),
            "html_preview": df.to_html(index=False, na_rep="", escape=False),
        }


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
        return "int64"
    elif "Float" in type:
        return "float64"
    elif "DateTime" in type:
        return "datetime64[ns]"
    else:
        raise ValueNotSupported("Field type not mapped", type)
