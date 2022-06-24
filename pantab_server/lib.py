import ast
import json
import traceback
import pandas as pd

SEP = ":SEP:"


def decode_message(msg):
    fn, args = msg.split(SEP)
    args = ast.literal_eval(args)
    return fn, args


def encode_message(fn, args):
    msg = f"{fn}{SEP}{json.dumps(args)}"
    return bytes(msg + "\n", "utf-8")


def encode_df(df):
    return bytes(json.dumps(df_to_dict(df)) + "\n", "utf-8")


def decode_df(encoded_df):
    df_dict = ast.literal_eval(encoded_df)
    return df_from_dict(df_dict)


def encode_error(err):
    data = {
        "klass": type(err).__name__,
        "message": str(err),
        "traceback": traceback.format_exc(),
    }
    return bytes("ERROR" + json.dumps(data) + "\n", "utf-8")


def decode_error(response):
    response = response.replace("ERROR", "")
    data_dict = ast.literal_eval(response)
    return data_dict


def df_to_dict(df):
    return {
        "df": df.astype(str).to_dict(),
        "dtypes": df.dtypes.astype(str).to_dict(),
    }


def df_from_dict(df_dict):
    dtypes = df_dict["dtypes"]
    return pd.DataFrame(df_dict["df"]).astype(dtypes)


def recv_all(sock):
    fragments = []
    buff_size = 1024 * 2
    while True:
        chunk = sock.recv(buff_size)
        fragments.append(chunk)
        if len(chunk) < buff_size:
            break

    return b"".join(fragments).strip().decode("utf-8")
