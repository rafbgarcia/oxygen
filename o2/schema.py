import graphene
from graphene_django import DjangoObjectType, DjangoListField

from o2.models import Dataset, DatasetTable

#########
# Queries
#########


class DatasetTableType(DjangoObjectType):
    class Meta:
        model = DatasetTable
        name = model.__name__
        fields = ("id", "name", "query", "fields", "total_records", "html_preview")


class DatasetType(DjangoObjectType):
    id = graphene.ID(required=True)
    name = graphene.String(required=True)
    is_building = graphene.Boolean(required=True)
    size_mb = graphene.Int()
    last_built_at = graphene.DateTime()
    build_duration_seconds = graphene.Float()
    tables = DjangoListField(DatasetTableType, required=True)

    class Meta:
        model = Dataset
        name = model.__name__


class Query(graphene.ObjectType):
    dataset = graphene.Field(DatasetType, id=graphene.ID(required=True), required=True)
    datasets = graphene.List(graphene.NonNull(DatasetType), required=True)

    def resolve_dataset(root, info, id):
        return Dataset.objects.get(pk=id)

    def resolve_datasets(root, info):
        return list(Dataset.objects.prefetch_related("tables").all())


###########
# Mutations
###########


class CreateDatasetTableMutationHandler(graphene.Mutation):
    class Arguments:
        dataset_id = graphene.ID(required=True)
        name = graphene.String(required=True)
        query = graphene.String(required=True)

    dataset = graphene.Field(DatasetType)

    @classmethod
    def mutate(cls, root, info, dataset_id, name, query):
        dataset = Dataset.objects.get(pk=dataset_id)
        dataset.tables.create(dataset_id=dataset_id, name=name, query=query)
        return CreateDatasetTableMutationHandler(dataset=dataset)


class Mutation(graphene.ObjectType):
    create_dataset = graphene.Field(DatasetType, name=graphene.String(required=True), required=True)
    create_dataset_table = CreateDatasetTableMutationHandler.Field()

    def resolve_create_dataset(root, info, name):
        dataset = Dataset.objects.create(name=name)
        return dataset


###################
# Schema definition
###################

schema = graphene.Schema(query=Query, mutation=Mutation)
