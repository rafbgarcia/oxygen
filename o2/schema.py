import graphene
from graphene_django import DjangoObjectType

from o2.models import Dataset, DatasetTable

#########
# Queries
#########


class DatasetType(DjangoObjectType):
    class Meta:
        model = Dataset
        name = model.__name__
        fields = ("id", "name", "is_building", "size_mb", "last_built_at", "build_duration_seconds", "tables")


class DatasetTableType(DjangoObjectType):
    class Meta:
        model = DatasetTable
        name = model.__name__
        fields = ("id", "name", "query", "fields", "total_records", "html_preview", "dataset")


class Query(graphene.ObjectType):
    dataset = graphene.Field(DatasetType, id=graphene.ID(required=True))
    datasets = graphene.List(DatasetType)

    def resolve_dataset(root, info, id):
        return Dataset.objects.get(pk=id)

    def resolve_datasets(root, info):
        return Dataset.objects.prefetch_related("tables").all()


###########
# Mutations
###########


class CreateDatasetMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    dataset = graphene.Field(DatasetType)

    @classmethod
    def mutate(cls, root, info, name):
        dataset = Dataset.objects.create(name=name)
        return CreateDatasetMutation(dataset=dataset)


class Mutation(graphene.ObjectType):
    create_dataset = CreateDatasetMutation.Field()


###################
# Schema definition
###################

schema = graphene.Schema(query=Query, mutation=Mutation)
