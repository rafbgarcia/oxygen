import graphene
from o2.dataset_helpers import DatasetHelper
from o2.dataset_table_helper import DatasetTableHelper
from o2.graphql.objects import DatasetObject, DatasetTableColumnObject
from o2.models import Dataset, DatasetTable, DatasetTableColumn


class ColumnInput(graphene.InputObjectType):
    foreign_key_id = graphene.ID()
    # Non-required generated type
    type = graphene.Field(DatasetTableColumnObject._meta.fields["type"].type.of_type)


class UpdateColumnMutationHandler(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        data = ColumnInput()

    Output = DatasetTableColumnObject

    def mutate(root, info, id, data):
        DatasetTableColumn.objects.filter(pk=id).update(**data)
        column = DatasetTableColumn.objects.prefetch_related("table").get(pk=id)
        if hasattr(data, "type"):
            preview = DatasetTableHelper.html_preview(column.table)
            DatasetTable.objects.filter(pk=column.table.id).update(html_preview=preview)
        return column
