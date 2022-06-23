import socketserver
import pantab
import json

##
# Protocol API
##


def to_bytes(dataframe):
    return bytes(json.dumps(dataframe.astype(str).to_dict()) + "\n", "utf-8")


def dataset_path(file_name):
    return f"/datasets/{file_name}"


def handle_frame_from_hyper_query(file_name, query):
    return to_bytes(pantab.frame_from_hyper_query(dataset_path(file_name), query))


FUNCTIONS = {
    "frame_from_hyper_query": handle_frame_from_hyper_query,
}


##
# Socket messaging handling
##


def handle_msg(msg):
    func_name, *args = msg.split(":ARG:")
    return FUNCTIONS[func_name](*args)


def recv_all(sock):
    fragments = []
    buff_size = 1024 * 2
    while True:
        chunk = sock.recv(buff_size)
        fragments.append(chunk)
        if len(chunk) < buff_size:
            break

    return b"".join(fragments).strip().decode("utf-8")


class TCPServer(socketserver.BaseRequestHandler):
    def handle(self):
        msg = recv_all(self.request)
        print(msg)
        result = handle_msg(msg)
        print(result)
        self.request.sendall(result)


if __name__ == "__main__":
    HOST, PORT = "0.0.0.0", 3333

    with socketserver.TCPServer((HOST, PORT), TCPServer) as server:
        print(f"Listening on {HOST}:{PORT}")
        server.serve_forever()
