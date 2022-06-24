import socketserver
import pantab
from .lib import decode_message, recv_all, encode_df, encode_error, df_from_dict

##
# API
##


def handle_frame_from_hyper_query(**args):
    return encode_df(pantab.frame_from_hyper_query(**args))


def handle_frame_to_hyper(**args):
    args["df"] = df_from_dict(args["df"])
    pantab.frame_to_hyper(**args)


FUNCTIONS = {
    "frame_from_hyper_query": handle_frame_from_hyper_query,
    "frame_to_hyper": handle_frame_to_hyper,
}


##
# Socket
##


class TCPServer(socketserver.BaseRequestHandler):
    def handle(self):
        msg = recv_all(self.request)
        fn, args = decode_message(msg)
        print(fn, args)

        try:
            result = FUNCTIONS[fn](**args)
            if result:
                self.request.sendall(result)

        except BaseException as err:
            result = encode_error(err)


if __name__ == "__main__":
    HOST, PORT = "0.0.0.0", 3333

    with socketserver.TCPServer((HOST, PORT), TCPServer) as server:
        print(f"Listening on {HOST}:{PORT}")
        server.serve_forever()
