try:
    from pantab import frame_from_hyper_query

except ModuleNotFoundError:
    import socket
    from common import recv_all, encode_message, decode_df, df_to_dict, decode_error
    import pandas as pd

    ##
    # Socket connection
    ##

    class PantabServerException(BaseException):
        def __init__(self, klass, message, traceback):
            super().__init__(f"\n\n\n--- PantabServerException ---\n{klass}: {message}\n{traceback}")

    HOST, PORT = "localhost", 3333

    def _send(fn, **args):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.connect((HOST, PORT))
            sock.sendall(encode_message(fn, args))
            received = recv_all(sock)
        if received.startswith("ERROR"):
            raise PantabServerException(**decode_error(received))
        else:
            return received

    ##
    # API
    ##

    def _dataset_path(database):
        return f"/datasets/{database}.hyper"

    def query(source, query) -> pd.DataFrame:
        response = _send("frame_from_hyper_query", source=_dataset_path(source), query=query)
        return decode_df(response)

    def append(df, database, table) -> None:
        _send(
            "frame_to_hyper",
            df=df_to_dict(df),
            database=_dataset_path(database),
            table=table,
            table_mode="a",
        )
