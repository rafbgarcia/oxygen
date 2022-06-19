from oracle.connectors import MySQLConnector
import pandas as pd


class DatasetTableHelper:
    @staticmethod
    def html_preview(table):
        with MySQLConnector().execute(table.query) as cursor:
            columns = cursor.column_names
            df = pd.DataFrame(cursor.fetchmany(25), columns=columns)

        df = df.astype(table.dtypes(), errors="ignore")
        return df.to_html(index=False, na_rep="", escape=False)
