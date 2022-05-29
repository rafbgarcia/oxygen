from django.test import SimpleTestCase
from o2.widgets.pivot import Pivot
from o2.dataset import append_to_dataset, dataset_exists, dataset_as_df
from o2.widgets._fixtures import pandas_df_to_dict


class PivotCase(SimpleTestCase):
    def setUp(self):
        self.maxDiff = None
        self.dataset = {
            "name": "test",
            "fields": [
                {"name": "title_name", "type": "Text"},
                {"name": "resulted_by", "type": "Text"},
                {"name": "application_id", "type": "Integer"},
                {"name": "follow_up_date", "type": "DateTime"},
                {"name": "follow_up_number", "type": "Integer"},
                {"name": "follow_up_result", "type": "Text"},
                {"name": "follow_up_date_string", "type": "Text"},
            ],
        }
        if not dataset_exists(self.dataset["name"]):
            append_to_dataset(
                filename=self.dataset["name"],
                table=self.dataset["name"],
                user_types={field["name"]: field["type"] for field in self.dataset["fields"]},
                rows=pandas_df_to_dict,
            )
        return super().setUp()

    #
    #
    def test_build_sql_count(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [
                {"agg": "COUNT", "name": "application_id", "alias": "Applications"},
            ],
        }
        expected = """
          SELECT test.follow_up_result AS "Result", count(test.application_id) AS "Applications"
          FROM test
          GROUP BY test.follow_up_result
          ORDER BY test.follow_up_result
        """
        self.assertHTMLEqual(Pivot(build_info, self.dataset).build_sql(), expected)

    #
    #
    def test_build_sql_count_countdistinct(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [
                {"agg": "COUNT", "name": "application_id", "alias": "Appls"},
                {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls"},
            ],
        }
        expected = """
          SELECT test.follow_up_result AS "Result", count(test.application_id) AS "Appls", count(distinct(test.application_id)) AS "Unique Appls"
          FROM test
          GROUP BY test.follow_up_result
          ORDER BY test.follow_up_result
        """
        self.assertHTMLEqual(Pivot(build_info, self.dataset).build_sql(), expected)

    #
    #
    def test_build_sql_2_rows(self):
        build_info = {
            "rows": [
                {"name": "follow_up_result", "alias": "Result"},
                {"name": "resulted_by", "alias": "User"},
            ],
            "columns": [],
            "values": [
                {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls"},
            ],
        }
        expected = """
           SELECT test.follow_up_result AS "Result", test.resulted_by AS "User", count(distinct(test.application_id)) AS "Unique Appls"
           FROM test
           GROUP BY test.follow_up_result, test.resulted_by
           ORDER BY test.follow_up_result, test.resulted_by
        """
        self.assertHTMLEqual(Pivot(build_info, self.dataset).build_sql(), expected)

    #
    #
    def test_build_contribution_percent_sign_label_doubles(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [
                {
                    "agg": "COUNT DISTINCT",
                    "name": "application_id",
                    "alias": "%",
                    "function": "CONTRIBUTION",
                },
            ],
        }
        self.assertRaises(
            KeyError,
            Pivot(build_info, self.dataset).build,
        )

    #
    #
    def test_build_sql_contribution_1_row(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [
                {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls", "function": ""},
                {
                    "agg": "COUNT DISTINCT",
                    "name": "application_id",
                    "alias": "%",
                    "function": "CONTRIBUTION",
                },
            ],
        }
        expected = """
            WITH anon_2 AS
            (SELECT test.follow_up_result AS follow_up_result, count(distinct(test.application_id)) AS "CONTRIBUTION_application_id"
            FROM test GROUP BY test.follow_up_result),
            anon_1 AS
            (SELECT CAST(sum(anon_2."CONTRIBUTION_application_id") AS FLOAT) AS "CONTRIBUTION_application_id"
            FROM anon_2)
            SELECT test.follow_up_result AS "Result", count(distinct(test.application_id)) AS "Unique Appls", count(distinct(test.application_id)) / max(anon_1."CONTRIBUTION_application_id") AS "%%"
            FROM test, anon_1
            GROUP BY test.follow_up_result
            ORDER BY test.follow_up_result
        """
        self.assertHTMLEqual(Pivot(build_info, self.dataset).build_sql(), expected)

    #
    #
    def test_build_sql_contribution_2_rows(self):
        build_info = {
            "rows": [
                {"name": "follow_up_result", "alias": "Result"},
                {"name": "resulted_by", "alias": "User"},
            ],
            "columns": [],
            "values": [
                {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls"},
                {
                    "agg": "COUNT DISTINCT",
                    "name": "application_id",
                    "alias": "Perc",
                    "function": "CONTRIBUTION",
                },
            ],
        }
        expected = """
            WITH anon_2 AS
            (SELECT test.follow_up_result AS follow_up_result, test.resulted_by AS resulted_by, count(distinct(test.application_id)) AS "CONTRIBUTION_application_id"
            FROM test GROUP BY test.follow_up_result, test.resulted_by),
            anon_1 AS
            (SELECT anon_2.follow_up_result AS follow_up_result, CAST(sum(anon_2."CONTRIBUTION_application_id") AS FLOAT) AS "CONTRIBUTION_application_id"
            FROM anon_2 GROUP BY anon_2.follow_up_result)
             SELECT test.follow_up_result AS "Result", test.resulted_by AS "User", count(distinct(test.application_id)) AS "Unique Appls", count(distinct(test.application_id)) / max(anon_1."CONTRIBUTION_application_id") AS "Perc"
            FROM test, anon_1
            GROUP BY test.follow_up_result, test.resulted_by
            ORDER BY test.follow_up_result, test.resulted_by
        """
        self.assertHTMLEqual(Pivot(build_info, self.dataset).build_sql(), expected)

    #
    #
    def test_build_sql_contribution_1_row_1_column(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "Result"}],
            "columns": [{"name": "follow_up_number", "alias": "Follow up"}],
            "values": [
                {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls"},
                {
                    "agg": "COUNT DISTINCT",
                    "name": "application_id",
                    "alias": "Perc",
                    "function": "CONTRIBUTION",
                },
            ],
        }
        expected = """
            WITH anon_2 AS
            (SELECT test.follow_up_result AS follow_up_result, count(distinct(test.application_id)) AS "CONTRIBUTION_application_id"
            FROM test GROUP BY test.follow_up_result),
            anon_1 AS
            (SELECT CAST(sum(anon_2."CONTRIBUTION_application_id") AS FLOAT) AS "CONTRIBUTION_application_id"
            FROM anon_2)
             SELECT test.follow_up_result AS "Result", test.follow_up_number AS "Follow up", count(distinct(test.application_id)) AS "Unique Appls", count(distinct(test.application_id)) / max(anon_1."CONTRIBUTION_application_id") AS "Perc"
            FROM test, anon_1
            GROUP BY test.follow_up_result, test.follow_up_number
            ORDER BY test.follow_up_result, test.follow_up_number
        """
        self.assertHTMLEqual(Pivot(build_info, self.dataset).build_sql(), expected)
