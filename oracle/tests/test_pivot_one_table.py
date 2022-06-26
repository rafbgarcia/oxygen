from django.test import TransactionTestCase
from oracle.models.dataset import Dataset
from oracle.widgets.pivot import Pivot, _build_sql
from oracle.tests.fixtures.territories_branches import (
    territories_df_to_dict,
    territories_columns,
    branches_df_to_dict,
    branches_columns,
)


class PivotCase(TransactionTestCase):
    def setUp(self):
        self.maxDiff = None

        Dataset.objects.all().delete()
        dataset = Dataset.objects.create(name="TA - Follow ups")

        territories = dataset.tables.create(name="Territories")
        territories.columns.set(territories_columns, bulk=False)
        branches = dataset.tables.create(name="Branches")
        branches.columns.set(branches_columns, bulk=False)

        dataset.tables.set([territories, branches])
        dataset.replace(territories, territories_df_to_dict)
        dataset.append(branches, branches_df_to_dict)

        self.dataset = dataset
        self.territories = territories
        self.branches = branches

    def tearDown(self):
        Dataset.objects.all().delete()

    #
    #
    def test_one_field(self):
        build_info = {
            "rows": [
                {
                    "table_id": self.territories.id,
                    "column_id": territories_columns[1].id,
                    "alias": "Territory",
                }
            ],
            "columns": [],
            "values": [],
        }
        pivot = Pivot.metadata(self.dataset, build_info)["html"]
        self.assertHTMLEqual(
            pivot,
            '<table border="1" class="dataframe"><thead><tr style="text-align: right;"><th></tr><tr><th>Territory</th></tr></thead><tbody><tr><th>Atlanta</th></tr><tr><th>Austin</th></tr><tr><th>Boston</th></tr><tr><th>Charlotte</th></tr><tr><th>Chicago</th></tr><tr><th>Connecticut</th></tr><tr><th>Dallas</th></tr><tr><th>Denver</th></tr><tr><th>Detroit</th></tr><tr><th>Houston</th></tr><tr><th>Long Island</th></tr><tr><th>Maryland</th></tr><tr><th>Nashville</th></tr><tr><th>New Jersey</th></tr><tr><th>Philadelphia</th></tr><tr><th>Phoenix</th></tr><tr><th>Pittsburgh</th></tr><tr><th>Tampa</th></tr></tbody></table>',
        )

    #
    #
    def _test_build_sql_count(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [
                {"agg": "COUNT", "name": "application_id", "alias": "Applications"},
            ],
        }
        expected = 'SELECT "Follow ups".follow_up_result AS "Result", count("Follow ups".application_id) AS "Applications" FROM "Follow ups" GROUP BY "Follow ups".follow_up_result ORDER BY "Follow ups".follow_up_result'
        self.assertHTMLEqual(_build_sql(self.dataset, build_info), expected)

    # #
    # #
    # def test_build_sql_count_countdistinct(self):
    #     build_info = {
    #         "rows": [{"name": "follow_up_result", "alias": "Result"}],
    #         "columns": [],
    #         "values": [
    #             {"agg": "COUNT", "name": "application_id", "alias": "Appls"},
    #             {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls"},
    #         ],
    #     }
    #     expected = 'SELECT test.follow_up_result AS "Result", count(test.application_id) AS "Appls", count(distinct(test.application_id)) AS "Unique Appls" FROM test GROUP BY test.follow_up_result ORDER BY test.follow_up_result'
    #     self.assertHTMLEqual(_build_sql(self.dataset, build_info), expected)

    # #
    # #
    # def test_build_sql_2_rows(self):
    #     build_info = {
    #         "rows": [
    #             {"name": "follow_up_result", "alias": "Result"},
    #             {"name": "resulted_by", "alias": "User"},
    #         ],
    #         "columns": [],
    #         "values": [
    #             {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls"},
    #         ],
    #     }
    #     expected = 'SELECT test.follow_up_result AS "Result", test.resulted_by AS "User", count(distinct(test.application_id)) AS "Unique Appls" FROM test GROUP BY test.follow_up_result, test.resulted_by ORDER BY test.follow_up_result, test.resulted_by'
    #     self.assertHTMLEqual(_build_sql(self.dataset, build_info), expected)

    # #
    # #
    # def test_build_sql_contribution_1_row(self):
    #     build_info = {
    #         "rows": [{"name": "follow_up_result", "alias": "Result"}],
    #         "columns": [],
    #         "values": [
    #             {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls", "function": ""},
    #             {
    #                 "agg": "COUNT DISTINCT",
    #                 "name": "application_id",
    #                 "alias": "%",
    #                 "function": "CONTRIBUTION",
    #             },
    #         ],
    #     }
    #     expected = 'WITH anon_2 AS (SELECT test.follow_up_result AS follow_up_result, count(distinct(test.application_id)) AS "COUNT DISTINCT_CONTRIBUTION_%" FROM test GROUP BY test.follow_up_result), anon_1 AS (SELECT CAST(sum(anon_2."COUNT DISTINCT_CONTRIBUTION_%") AS FLOAT) AS "COUNT DISTINCT_CONTRIBUTION_%" FROM anon_2) SELECT test.follow_up_result AS "Result", count(distinct(test.application_id)) AS "Unique Appls", count(distinct(test.application_id)) / max(anon_1."COUNT DISTINCT_CONTRIBUTION_%") AS "%" FROM test, anon_1 GROUP BY test.follow_up_result ORDER BY test.follow_up_result'
    #     self.assertHTMLEqual(_build_sql(self.dataset, build_info), expected)

    # #
    # #
    # def test_build_sql_contribution_2_rows(self):
    #     build_info = {
    #         "rows": [
    #             {"name": "follow_up_result", "alias": "Result"},
    #             {"name": "resulted_by", "alias": "User"},
    #         ],
    #         "columns": [],
    #         "values": [
    #             {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls"},
    #             {
    #                 "agg": "COUNT DISTINCT",
    #                 "name": "application_id",
    #                 "alias": "Perc",
    #                 "function": "CONTRIBUTION",
    #             },
    #         ],
    #     }
    #     expected = 'WITH anon_2 AS (SELECT test.follow_up_result AS follow_up_result, test.resulted_by AS resulted_by, count(distinct(test.application_id)) AS "COUNT DISTINCT_CONTRIBUTION_Perc" FROM test GROUP BY test.follow_up_result, test.resulted_by), anon_1 AS (SELECT anon_2.follow_up_result AS follow_up_result, CAST(sum(anon_2."COUNT DISTINCT_CONTRIBUTION_Perc") AS FLOAT) AS "COUNT DISTINCT_CONTRIBUTION_Perc" FROM anon_2 GROUP BY anon_2.follow_up_result) SELECT test.follow_up_result AS "Result", test.resulted_by AS "User", count(distinct(test.application_id)) AS "Unique Appls", count(distinct(test.application_id)) / max(anon_1."COUNT DISTINCT_CONTRIBUTION_Perc") AS "Perc" FROM test, anon_1 GROUP BY test.follow_up_result, test.resulted_by ORDER BY test.follow_up_result, test.resulted_by'
    #     self.assertHTMLEqual(_build_sql(self.dataset, build_info), expected)

    # #
    # #
    # def test_build_sql_contribution_1_row_1_column(self):
    #     build_info = {
    #         "rows": [{"name": "follow_up_result", "alias": "Result"}],
    #         "columns": [{"name": "follow_up_number", "alias": "Follow up"}],
    #         "values": [
    #             {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls"},
    #             {
    #                 "agg": "COUNT DISTINCT",
    #                 "name": "application_id",
    #                 "alias": "Perc",
    #                 "function": "CONTRIBUTION",
    #             },
    #         ],
    #     }
    #     expected = 'WITH anon_2 AS (SELECT test.follow_up_result AS follow_up_result, count(distinct(test.application_id)) AS "COUNT DISTINCT_CONTRIBUTION_Perc" FROM test GROUP BY test.follow_up_result), anon_1 AS (SELECT CAST(sum(anon_2."COUNT DISTINCT_CONTRIBUTION_Perc") AS FLOAT) AS "COUNT DISTINCT_CONTRIBUTION_Perc" FROM anon_2) SELECT test.follow_up_result AS "Result", test.follow_up_number AS "Follow up", count(distinct(test.application_id)) AS "Unique Appls", count(distinct(test.application_id)) / max(anon_1."COUNT DISTINCT_CONTRIBUTION_Perc") AS "Perc" FROM test, anon_1 GROUP BY test.follow_up_result, test.follow_up_number ORDER BY test.follow_up_result, test.follow_up_number'
    #     self.assertHTMLEqual(_build_sql(self.dataset, build_info), expected)

    # #
    # #
    # def test_metadata(self):
    #     build_info = {
    #         "rows": [{"name": "follow_up_result", "alias": "Result"}],
    #         "columns": [],
    #         "values": [
    #             {
    #                 "agg": "COUNT DISTINCT",
    #                 "name": "application_id",
    #                 "alias": "Perc",
    #                 "function": "CONTRIBUTION",
    #             },
    #         ],
    #     }
    #     self.assertIn("html", Pivot.metadata(self.dataset, build_info))
