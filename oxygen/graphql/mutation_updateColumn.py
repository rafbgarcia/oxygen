import graphene
from oxygen.classes.dataset_tables import DatasetTables
from oxygen.graphql.objects import DatasetTableColumnObject
from oxygen.models.dataset_table import DatasetTable
from oxygen.models.dataset_table_column import DatasetTableColumn


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
            DatasetTable.objects.filter(pk=column.table.id).update(
                html_preview=DatasetTables.preview_with_column_types(column.table)
            )

        return column
