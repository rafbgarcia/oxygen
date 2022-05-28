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

    ##
    # Test building table as HTML with COUNT and DISTINCT COUNT
    ##
    def test_metadata(self):
        build_info = {
            "categories": [{"field": "follow_up_result", "alias": "Result"}],
            "breakby": [],
            "values": [
                {"function": "COUNT DISTINCT", "field": "application_id", "alias": "Applications"},
            ],
        }

        expected = {
            "chartData": [
                {"data": [2], "name": "candidate_not_interested"},
                {"data": [1], "name": "sent_email_no_call"},
                {"data": [1], "name": "power_not_interested"},
                {"data": [1], "name": "callback"},
                {"data": [9], "name": "answering_machine_left_via_voicemail"},
                {"data": [1], "name": "no_answer"},
            ],
            "legend": True,
            "xAxisCategories": [],
        }
        self.assertEqual(VerticalBarChart(build_info, self.dataset).metadata(), expected)
