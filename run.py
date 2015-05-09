import sys
import SimpleHTTPServer
import SocketServer

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler


if __name__ == "__main__":
    try:
        port = int(sys.argv[1])
    except IndexError:
        port = 8080
    httpd = SocketServer.TCPServer(("", port), Handler)
    print "serving at port", port
    httpd.serve_forever()
