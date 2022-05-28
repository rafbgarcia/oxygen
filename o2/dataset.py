import pandas as pd
import pantab
from powerBi.settings import BASE_DIR
from os.path import exists

DATASETS_FOLDER = BASE_DIR
TABLE_MODE_APPEND = "a"


def map_dtypes_user_types(dtypes_dict):
    dtypes = {}
    for key in dtypes_dict:
        dtype = dtypes_dict[key].lower()
        if "object" in dtype:
            dtypes[key] = "Text"
        elif "int" in dtype:
            dtypes[key] = "Integer"
        elif "float" in dtype:
            dtypes[key] = "Float"
        elif "datetime" in dtype:
            dtypes[key] = "DateTime"
        elif "bool" in dtype:
            dtypes[key] = "Boolean"
    return dtypes


def map_user_types_to_dtypes(user_types):
    dtypes = {}
    for key in user_types:
        type = user_types[key]
        if "Text" in type:
            dtypes[key] = "object"
        elif "Integer" in type:
            dtypes[key] = "int64"
        elif "Float" in type:
            dtypes[key] = "float64"
        elif "DateTime" in type:
            dtypes[key] = "datetime64[ns]"
        elif "Boolean" in type:
            dtypes[key] = "bool"
    return dtypes


def __filepath(filename):
    return DATASETS_FOLDER / f"{filename}.hyper"


def append_to_dataset(filename, table, user_types, rows):
    dtypes = map_user_types_to_dtypes(user_types)

    df = pd.DataFrame(rows, columns=list(dtypes.keys()))
    df = df.astype(dtypes)
    pantab.frame_to_hyper(df, __filepath(filename), table=table, table_mode=TABLE_MODE_APPEND)


def dataset_exists(filename):
    return exists(__filepath(filename))


def dataset_execute(filename, query):
    return pantab.frame_from_hyper_query(__filepath(filename), query)


def dataset_as_df(filename, table):
    return pantab.frame_from_hyper(__filepath(filename), table=table)
