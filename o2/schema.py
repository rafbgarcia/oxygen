import graphene
from graphene_django import DjangoObjectType, DjangoListField
from o2.dataset_helpers import DatasetHelper

from o2.models import Dataset, DatasetTable


#########
# Objects
#########


class DatasetTableFieldsType(graphene.ObjectType):
    name = graphene.String(required=True)
    type = graphene.String(required=True)

    class Meta:
        name = "DatasetTableFields"


class DatasetTableType(DjangoObjectType):
    id = graphene.ID(required=True)
    name = graphene.String(required=True)
    query = graphene.String(required=True)
    fields = graphene.List(graphene.NonNull(DatasetTableFieldsType), required=True)
    html_preview = graphene.String(required=True)
    total_records = graphene.Int()

    class Meta:
        model = DatasetTable
        name = model.__name__


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


#########
# Queries
#########


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
        preview = DatasetHelper.preview(query)
        dataset.tables.create(
            dataset_id=dataset_id,
            name=name,
            query=query,
            fields=preview["fields"],
            html_preview=preview["html_preview"],
        )

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
