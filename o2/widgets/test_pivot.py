from MySQLdb import Timestamp
from django.test import SimpleTestCase
from o2.widgets.pivot import Pivot
from o2.dataset import append_to_dataset, dataset_exists, dataset_as_df
from o2.widgets.test_fixture import pandas_df_to_dict
import pandas as pd


class PivotCase(SimpleTestCase):
    def setUp(self):
        self.maxDiff = None
        self.dataset = {
            "name": "table name",
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
        if not dataset_exists("test"):
            append_to_dataset(
                filename="test",
                table=self.dataset["name"],
                user_types={field["name"]: field["type"] for field in self.dataset["fields"]},
                rows=pandas_df_to_dict,
            )
        return super().setUp()

    def tearDown(self):
        return super().tearDown()

    ##
    # Test building SQL with COUNT
    ##
    def test_build_sql_count(self):
        build_info = {
            "rows": [{"field": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [
                {"function": "COUNT", "field": "application_id", "alias": "Applications"},
            ],
        }
        expected = """
SELECT follow_up_result AS "Result", count("table name".application_id) AS "Applications"
FROM "table name" GROUP BY "table name".follow_up_result
""".strip()
        self.assertEqual(Pivot(build_info, self.dataset).build_sql().replace(" \n", "\n"), expected)

    ##
    # Test building SQL with COUNT and DISTINCT COUNT
    ##
    def test_build_sql_count_countdistinct(self):
        build_info = {
            "rows": [{"field": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [
                {"function": "COUNT", "field": "application_id", "alias": "Appls"},
                {"function": "COUNT DISTINCT", "field": "application_id", "alias": "Unique Appls"},
            ],
        }
        expected = """
SELECT follow_up_result AS "Result", count("table name".application_id) AS "Appls", count(distinct("table name".application_id)) AS "Unique Appls"
FROM "table name" GROUP BY "table name".follow_up_result
""".strip()
        self.assertEqual(Pivot(build_info, self.dataset).build_sql().replace(" \n", "\n"), expected)

    ##
    # Test building table as HTML with COUNT and DISTINCT COUNT
    ##
    def test_build(self):
        build_info = {
            "rows": [{"field": "follow_up_result", "alias": "follow_up_result"}],
            "columns": [],
            "values": [
                {"function": "COUNT", "field": "application_id", "alias": "Appls"},
                {"function": "COUNT DISTINCT", "field": "application_id", "alias": "Unique Appls"},
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
    <tr>
      <th>follow_up_result</th>
      <th></th>
      <th></th>
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
""".strip()
        self.assertEqual(Pivot(build_info, self.dataset).build(), expected)
