import graphene
from oracle.classes.dataset_tables import DatasetTables
from oracle.graphql.objects import DatasetObject
from oracle.models.dataset import Dataset
from oracle.models.dataset_table import DatasetTable
from oracle.models.dataset_table_column import DatasetTableColumn
import oracle.helpers as helpers


class CreateDatasetTableMutationHandler(graphene.Mutation):
    class Arguments:
        dataset_id = graphene.ID(required=True)
        name = graphene.String(required=True)
        query = graphene.String(required=True)

    Output = DatasetObject

    def mutate(root, info, dataset_id, name, query):
        dataset = Dataset.objects.get(pk=dataset_id)
        table = DatasetTable(dataset_id=dataset.id, title=name, name=helpers.snakecase(name), query=query)
        html_preview, columns = DatasetTables.preview_and_columns(table)

        table.html_preview = html_preview
        table.save()
        table.columns.set(columns, bulk=False)

        return dataset
