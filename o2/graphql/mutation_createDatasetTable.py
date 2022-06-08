import graphene
import humps
from o2.graphql.objects import DatasetObject
from o2.dataset_helpers import DatasetHelper
from o2.models import Dataset, DatasetTableColumn


class CreateDatasetTableMutationHandler(graphene.Mutation):
    class Arguments:
        dataset_id = graphene.ID(required=True)
        name = graphene.String(required=True)
        query = graphene.String(required=True)

    Output = DatasetObject

    def mutate(root, info, dataset_id, name, query):
        dataset = Dataset.objects.get(pk=dataset_id)
        columns, preview = DatasetHelper.preview(query)
        table = dataset.tables.create(
            title=name,
            name=humps.decamelize(humps.camelize(name)),
            query=query,
            html_preview=preview,
        )
        table.columns.set([DatasetTableColumn(**column) for column in columns], bulk=False)

        return dataset
