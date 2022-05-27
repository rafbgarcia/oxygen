from django.test import SimpleTestCase

from o2.widgets.pivot import Pivot


class PivotCase(SimpleTestCase):
    def setUp(self):
        # Create hyper file
        pass

    def test_build_sql(self):
        self.maxDiff = None
        build_info = {
            "rows": [{"field": "follow_up_result", "alias": "Result"}],
            "columns": [],
            "values": [{"function": "COUNT DISTINCT", "field": "application_id", "alias": "Follow ups"}],
        }
        dataset = {
            "name": "table name",
            "fields": [
                {"name": "title_name", type: "Text"},
                {"name": "resulted_by", type: "Text"},
                {"name": "application_id", type: "Integer"},
                {"name": "follow_up_date", type: "DateTime"},
                {"name": "follow_up_number", type: "Integer"},
                {"name": "follow_up_result", type: "Text"},
                {"name": "follow_up_date_string", type: "Text"},
            ],
        }

        expected = 'SELECT count(distinct("table name".application_id)) AS "Follow ups" \n'
        expected += 'FROM "table name" GROUP BY "table name".follow_up_result'
        self.assertEqual(Pivot(build_info, dataset).build_sql(), expected)
