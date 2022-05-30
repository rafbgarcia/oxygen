from django.test import SimpleTestCase
from o2.models import Dataset
from o2.widgets.vertical_bar_chart import VerticalBarChart
from o2.widgets._fixtures import pandas_df_to_dict


class VerticalBarChartCase(SimpleTestCase):
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
