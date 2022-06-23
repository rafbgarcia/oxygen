import mysql.connector
from contextlib import contextmanager

connection_config = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "talkbox",
    "database": "pws_dev",
}


class MySQLConnector(object):
    def __init__(self, config=connection_config):
        self.config = config

    @contextmanager
    def execute(self, query):
        conn = mysql.connector.connect(**self.config)
        cursor = conn.cursor()
        cursor.execute(query)
        yield cursor
        conn.close()
