import graphene
from o2.graphql.objects import DatasetObject
from o2.dataset_helpers import DatasetHelper
from o2.models import Dataset


class CreateDatasetTableMutationHandler(graphene.Mutation):
    class Arguments:
        dataset_id = graphene.ID(required=True)
        name = graphene.String(required=True)
        query = graphene.String(required=True)

    Output = DatasetObject

    @classmethod
    def mutate(cls, root, info, dataset_id, name, query):
        dataset = Dataset.objects.get(pk=dataset_id)
        preview = DatasetHelper.preview(query)
        dataset.tables.create(
            name=name,
            query=query,
            fields=preview["fields"],
            html_preview=preview["html_preview"],
        )

        return dataset
