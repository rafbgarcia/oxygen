import graphene
from o2.graphql.objects import DatasetObject
from o2.models import Dataset


class CreateDatasetMutationHandler(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    Output = DatasetObject

    def mutate(root, info, name):
        return Dataset.objects.create(name=name)
