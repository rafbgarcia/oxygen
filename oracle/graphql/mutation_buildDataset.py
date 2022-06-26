import graphene
from oracle.models.dataset import Dataset
from oracle.graphql.objects import DatasetObject


class BuildDatasetMutationHandler(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    Output = graphene.NonNull(DatasetObject)

    def mutate(root, info, id):
        return Dataset.build(id)
