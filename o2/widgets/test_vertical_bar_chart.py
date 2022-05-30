from django.test import SimpleTestCase
from o2.widgets.vertical_bar_chart import VerticalBarChart
from o2.dataset import append_to_dataset, dataset_exists
from o2.widgets._fixtures import pandas_df_to_dict


class VerticalBarChartCase(SimpleTestCase):
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
                filename="test",
                table=self.dataset["name"],
                user_types={field["name"]: field["type"] for field in self.dataset["fields"]},
                rows=pandas_df_to_dict,
            )
        return super().setUp()

    def test_metadata(self):
        build_info = {
            "rows": [{"name": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [
                {"agg": "COUNT DISTINCT", "name": "application_id", "alias": "Applications"},
            ],
        }

        result = VerticalBarChart.metadata(self.dataset, build_info)
        self.assertIn("id", result)
        self.assertIn("chartData", result)
        self.assertIn("xAxisCategories", result)
        self.assertIn("legend", result)
