import graphene
from graphene_django import DjangoObjectType, DjangoListField
from o2.dataset_helpers import DatasetHelper
from o2.models import Dashboard, Dataset, DatasetTable, Widget


#########
# Objects
#########


class DatasetTableFieldsType(graphene.ObjectType):
    name = graphene.String(required=True)
    type = graphene.String(required=True)

    class Meta:
        name = "DatasetTableFields"


class DatasetTableType(DjangoObjectType):
    fields = graphene.List(graphene.NonNull(DatasetTableFieldsType), required=True)

    class Meta:
        model = DatasetTable
        name = model.__name__


class DatasetType(DjangoObjectType):
    size_mb = graphene.Float()

    class Meta:
        model = Dataset
        name = model.__name__


class DashboardType(DjangoObjectType):
    class Meta:
        model = Dashboard
        name = model.__name__


class WidgetType(DjangoObjectType):
    class Meta:
        model = Widget
        name = model.__name__


#########
# Queries
#########


class Query(graphene.ObjectType):
    dataset = graphene.Field(DatasetType, id=graphene.ID(required=True), required=True)
    datasets = graphene.List(graphene.NonNull(DatasetType), required=True)

    dashboard = graphene.Field(DashboardType, id=graphene.ID(required=True), required=True)
    dashboards = graphene.List(graphene.NonNull(DashboardType), required=True)

    def resolve_dataset(root, info, id):
        return Dataset.objects.get(pk=id)

    def resolve_datasets(root, info):
        return Dataset.objects.prefetch_related("tables").all()

    def resolve_dashboard(root, info, id):
        return Dashboard.objects.prefetch_related("widgets").get(pk=id)

    def resolve_dashboards(root, info):
        return Dashboard.objects.prefetch_related("widgets").all()


###########
# Mutations
###########


class CreateDatasetTableMutationHandler(graphene.Mutation):
    class Arguments:
        dataset_id = graphene.ID(required=True)
        name = graphene.String(required=True)
        query = graphene.String(required=True)

    Output = DatasetType

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


class Mutation(graphene.ObjectType):
    create_dataset = graphene.Field(DatasetType, name=graphene.String(required=True), required=True)
    build_dataset = graphene.Field(DatasetType, id=graphene.ID(required=True), required=True)
    create_dataset_table = CreateDatasetTableMutationHandler.Field()

    create_dashboard = graphene.Field(
        DashboardType,
        name=graphene.String(required=True),
        dataset_id=graphene.ID(required=True),
        required=True,
    )

    def resolve_create_dataset(root, info, name):
        return Dataset.objects.create(name=name)

    def resolve_build_dataset(root, info, id):
        return Dataset.build(id)

    def resolve_create_dashboard(root, info, name, dataset_id):
        return Dashboard.objects.create(name=name, dataset_id=dataset_id)


###################
# Schema definition
###################

schema = graphene.Schema(query=Query, mutation=Mutation)
