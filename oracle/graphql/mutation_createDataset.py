import graphene
from oracle.graphql.objects import DatasetObject
from oracle.models import Dataset
import oracle.helpers as helpers


class CreateDatasetMutationHandler(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    Output = DatasetObject

    def mutate(root, info, name):
        return Dataset.objects.create(name=name, file_name=helpers.snakecase(name))
