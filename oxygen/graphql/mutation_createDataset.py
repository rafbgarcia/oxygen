import graphene
from oxygen.graphql.objects import DatasetObject
from oxygen.models.dataset import Dataset
import oxygen.helpers as helpers


class CreateDatasetMutationHandler(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    Output = DatasetObject

    def mutate(root, info, name):
        return Dataset.objects.create(name=name, file_name=helpers.snakecase(name))
