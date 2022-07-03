import graphene
from oxygen.models.dataset_table import DatasetTable
from oxygen.graphql.objects import DatasetTableObject


class DatasetTableInput(graphene.InputObjectType):
    x = graphene.Int()
    y = graphene.Int()


class UpdateDatasetTableMutationHandler(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        params = graphene.Argument(DatasetTableInput, required=True)

    Output = graphene.NonNull(DatasetTableObject)

    def mutate(root, info, id, params):
        DatasetTable.objects.filter(pk=id).update(**params)
        return DatasetTable.objects.get(pk=id)
