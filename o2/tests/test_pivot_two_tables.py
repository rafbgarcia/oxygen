from django.test import TransactionTestCase
from o2.models import Dataset, DatasetTable
from o2.widgets.pivot import Pivot, _build_sql
from o2.tests.fixtures.territories_branches import (
    territories_df_to_dict,
    territories_columns,
    branches_df_to_dict,
    branches_columns,
)
from unittest.mock import MagicMock, Mock


class PivotCase(TransactionTestCase):
    @classmethod
    def setUpClass(self):
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

    @classmethod
    def tearDownClass(self) -> None:
        Dataset.objects.all().delete()

    #
    #
    def test_two_tables_join(self):
        build_info = {
            "rows": [{"column_id": territories_columns[1].id, "alias": "Territory"}],
            "columns": [],
            "values": [
                {"column_id": branches_columns[0].id, "agg": "COUNT", "alias": "# of branches"},
            ],
        }
        expected = {
            "# of branches": {
                ("Atlanta",): 1,
                ("Austin",): 1,
                ("Boston",): 1,
                ("Charlotte",): 1,
                ("Chicago",): 2,
                ("Connecticut",): 1,
                ("Dallas",): 2,
                ("Denver",): 1,
                ("Detroit",): 1,
                ("Houston",): 1,
                ("Long Island",): 2,
                ("Maryland",): 3,
                ("Nashville",): 1,
                ("New Jersey",): 2,
                ("Philadelphia",): 1,
                ("Phoenix",): 1,
                ("Pittsburgh",): 1,
                ("Tampa",): 1,
            }
        }
        pivot = Pivot.build(self.dataset, build_info).to_dict()
        self.assertDictEqual(pivot, expected)
        # self.assertHTMLEqual(_build_sql(self.dataset, build_info), "expected")

    # #
    # #
    # def test_build_sql_count_countdistinct(self):
    #     build_info = {
    #         "rows": [{"table_id": "1", "name": "name", "alias": "Territory"}],
    #         "columns": [],
    #         "values": [
    #             {"table_id": "2", "agg": "COUNT", "name": "id", "alias": "# of branches"},
    #             {"table_id": "1", "agg": "COUNT DISTINCT", "name": "id", "alias": "# of territories"},
    #         ],
    #     }
    #     expected = ""
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
