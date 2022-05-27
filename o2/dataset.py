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
