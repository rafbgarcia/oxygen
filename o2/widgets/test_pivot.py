from django.test import SimpleTestCase
from o2.models import Dataset
from o2.widgets.pivot import Pivot, _build_sql
from o2.widgets._fixtures import pandas_df_to_dict


class PivotCase(SimpleTestCase):
    def setUp(self):
        self.maxDiff = None
        self.dataset = Dataset(
            name="test",
            fields=[
                {"name": "title_name", "type": "Text"},
                {"name": "resulted_by", "type": "Text"},
                {"name": "application_id", "type": "Integer"},
                {"name": "follow_up_date", "type": "DateTime"},
                {"name": "follow_up_number", "type": "Integer"},
                {"name": "follow_up_result", "type": "Text"},
                {"name": "follow_up_date_string", "type": "Text"},
            ],
        )
        if not self.dataset.exists():
            self.dataset.append(pandas_df_to_dict)
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
        expected = 'SELECT test.follow_up_result AS "Result", count(test.application_id) AS "Applications" FROM test GROUP BY test.follow_up_result ORDER BY test.follow_up_result'
        self.assertHTMLEqual(_build_sql(self.dataset, build_info), expected)

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
        expected = 'SELECT test.follow_up_result AS "Result", count(test.application_id) AS "Appls", count(distinct(test.application_id)) AS "Unique Appls" FROM test GROUP BY test.follow_up_result ORDER BY test.follow_up_result'
        self.assertHTMLEqual(_build_sql(self.dataset, build_info), expected)

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
        expected = 'SELECT test.follow_up_result AS "Result", test.resulted_by AS "User", count(distinct(test.application_id)) AS "Unique Appls" FROM test GROUP BY test.follow_up_result, test.resulted_by ORDER BY test.follow_up_result, test.resulted_by'
        self.assertHTMLEqual(_build_sql(self.dataset, build_info), expected)

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
        expected = 'WITH anon_2 AS (SELECT test.follow_up_result AS follow_up_result, count(distinct(test.application_id)) AS "COUNT DISTINCT_CONTRIBUTION_%" FROM test GROUP BY test.follow_up_result), anon_1 AS (SELECT CAST(sum(anon_2."COUNT DISTINCT_CONTRIBUTION_%") AS FLOAT) AS "COUNT DISTINCT_CONTRIBUTION_%" FROM anon_2) SELECT test.follow_up_result AS "Result", count(distinct(test.application_id)) AS "Unique Appls", count(distinct(test.application_id)) / max(anon_1."COUNT DISTINCT_CONTRIBUTION_%") AS "%" FROM test, anon_1 GROUP BY test.follow_up_result ORDER BY test.follow_up_result'
        self.assertHTMLEqual(_build_sql(self.dataset, build_info), expected)

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
        expected = 'WITH anon_2 AS (SELECT test.follow_up_result AS follow_up_result, test.resulted_by AS resulted_by, count(distinct(test.application_id)) AS "COUNT DISTINCT_CONTRIBUTION_Perc" FROM test GROUP BY test.follow_up_result, test.resulted_by), anon_1 AS (SELECT anon_2.follow_up_result AS follow_up_result, CAST(sum(anon_2."COUNT DISTINCT_CONTRIBUTION_Perc") AS FLOAT) AS "COUNT DISTINCT_CONTRIBUTION_Perc" FROM anon_2 GROUP BY anon_2.follow_up_result) SELECT test.follow_up_result AS "Result", test.resulted_by AS "User", count(distinct(test.application_id)) AS "Unique Appls", count(distinct(test.application_id)) / max(anon_1."COUNT DISTINCT_CONTRIBUTION_Perc") AS "Perc" FROM test, anon_1 GROUP BY test.follow_up_result, test.resulted_by ORDER BY test.follow_up_result, test.resulted_by'
        self.assertHTMLEqual(_build_sql(self.dataset, build_info), expected)

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
        expected = 'WITH anon_2 AS (SELECT test.follow_up_result AS follow_up_result, count(distinct(test.application_id)) AS "COUNT DISTINCT_CONTRIBUTION_Perc" FROM test GROUP BY test.follow_up_result), anon_1 AS (SELECT CAST(sum(anon_2."COUNT DISTINCT_CONTRIBUTION_Perc") AS FLOAT) AS "COUNT DISTINCT_CONTRIBUTION_Perc" FROM anon_2) SELECT test.follow_up_result AS "Result", test.follow_up_number AS "Follow up", count(distinct(test.application_id)) AS "Unique Appls", count(distinct(test.application_id)) / max(anon_1."COUNT DISTINCT_CONTRIBUTION_Perc") AS "Perc" FROM test, anon_1 GROUP BY test.follow_up_result, test.follow_up_number ORDER BY test.follow_up_result, test.follow_up_number'
        self.assertHTMLEqual(_build_sql(self.dataset, build_info), expected)

    #
    #
    def test_metadata(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [
                {
                    "agg": "COUNT DISTINCT",
                    "name": "application_id",
                    "alias": "Perc",
                    "function": "CONTRIBUTION",
                },
            ],
        }
        self.assertIn("html", Pivot.metadata(self.dataset, build_info))
