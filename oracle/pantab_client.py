try:
    from pantab import frame_from_hyper_query

except ModuleNotFoundError:
    import socket
    import ast
    import pandas as pd

    def _recv_all(sock):
        fragments = []
        buff_size = 1024 * 2
        while True:
            chunk = sock.recv(buff_size)
            fragments.append(chunk)
            if len(chunk) < buff_size:
                break

        return b"".join(fragments).strip().decode("utf-8")

    HOST, PORT = "localhost", 3333

    def _msg(data):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.connect((HOST, PORT))
            sock.sendall(bytes(data + "\n", "utf-8"))
            received = _recv_all(sock)

        return ast.literal_eval(received)

    def frame_from_hyper_query(file_path, query):
        dataframe_as_dict = _msg(f"frame_from_hyper_query:ARG:{file_path}:ARG:{query}")
        df = pd.DataFrame(dataframe_as_dict)
        return df

    print(frame_from_hyper_query("my_dataset.hyper", "select * from territories"))
