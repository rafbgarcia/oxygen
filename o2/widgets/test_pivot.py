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
    def _test_build_sql_count(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [
                {"agg": "COUNT", "name": "application_id", "alias": "Applications"},
            ],
        }
        expected = """
          SELECT follow_up_result AS "Result", count(test.application_id) AS "Applications"
          FROM test GROUP BY test.follow_up_result
        """
        self.assertHTMLEqual(Pivot(build_info, self.dataset).build_sql(), expected)

    #
    #
    def _test_build_sql_count_countdistinct(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [
                {"agg": "COUNT", "name": "application_id", "alias": "Appls"},
                {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls"},
            ],
        }
        expected = """
          SELECT follow_up_result AS "Result", count(test.application_id) AS "Appls", count(distinct(test.application_id)) AS "Unique Appls"
          FROM test
          GROUP BY test.follow_up_result
        """
        self.assertHTMLEqual(Pivot(build_info, self.dataset).build_sql(), expected)

    #
    #
    def test_build_sql_contribution(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [
                {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls"},
                {
                    "agg": "COUNT DISTINCT",
                    "name": "application_id",
                    "alias": "%",
                    "function": "CONTRIBUTION",
                },
            ],
        }
        expected = """
        """
        self.assertEqual(Pivot(build_info, self.dataset).build_sql(), expected)

    #
    #
    def _test_metadata_with_function(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "follow_up_result"}],
            "columns": [],
            "values": [
                {"agg": "COUNT", "name": "application_id", "alias": "Appls"},
                {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls"},
            ],
        }

        expected = """"""
        result = Pivot(build_info, self.dataset).metadata()

        self.assertHTMLEqual(result["html"], expected)

    def _test_metadata(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "follow_up_result"}],
            "columns": [],
            "values": [
                {"agg": "COUNT", "name": "application_id", "alias": "Appls"},
                {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Unique Appls"},
            ],
        }

        expected = """
          <table border="1" class="dataframe">
            <thead>
              <tr style="text-align: right;">
                <th></th>
                <th>Appls</th>
                <th>Unique Appls</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>candidate_not_interested</th>
                <td>2</td>
                <td>2</td>
              </tr>
              <tr>
                <th>sent_email_no_call</th>
                <td>1</td>
                <td>1</td>
              </tr>
              <tr>
                <th>power_not_interested</th>
                <td>1</td>
                <td>1</td>
              </tr>
              <tr>
                <th>callback</th>
                <td>1</td>
                <td>1</td>
              </tr>
              <tr>
                <th>answering_machine_left_via_voicemail</th>
                <td>16</td>
                <td>9</td>
              </tr>
              <tr>
                <th>no_answer</th>
                <td>4</td>
                <td>1</td>
              </tr>
            </tbody>
          </table>
        """
        result = Pivot(build_info, self.dataset).metadata()

        self.assertIn("html", result)
        self.assertHTMLEqual(result["html"], expected)
