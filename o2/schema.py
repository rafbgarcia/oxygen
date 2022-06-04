from pydoc import describe
import graphene
from graphene_django import DjangoObjectType, DjangoListField
from o2.dataset_helpers import DatasetHelper
from o2.graphql.mutation_createDataset import CreateDatasetTableMutationHandler
from o2.graphql.mutation_updateWidgetBuildInfo import UpdateWidgetBuildInfoMutationHandler
from o2.graphql.types.json import JSON
from o2.models import Dashboard, Dataset, DatasetTable, Widget
from o2.graphql.mutation_createWidget import CreateWidgetMutationHandler
from o2.graphql.objects import DatasetObject, DashboardObject, WidgetObject


#########
# Queries
#########


class Query(graphene.ObjectType):
    dataset = graphene.Field(DatasetObject, id=graphene.ID(required=True), required=True)
    datasets = graphene.List(graphene.NonNull(DatasetObject), required=True)

    dashboard = graphene.Field(DashboardObject, id=graphene.ID(required=True), required=True)
    dashboards = graphene.List(graphene.NonNull(DashboardObject), required=True)

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


class Mutation(graphene.ObjectType):
    create_dataset = graphene.Field(DatasetObject, name=graphene.String(required=True), required=True)
    build_dataset = graphene.Field(DatasetObject, id=graphene.ID(required=True), required=True)
    create_dataset_table = CreateDatasetTableMutationHandler.Field()

    create_dashboard = graphene.Field(
        DashboardObject,
        name=graphene.String(required=True),
        dataset_id=graphene.ID(required=True),
        required=True,
    )
    create_widget = CreateWidgetMutationHandler.Field()
    update_widget_build_info = UpdateWidgetBuildInfoMutationHandler.Field()
    delete_widget = graphene.Field(DashboardObject, widget_id=graphene.ID(required=True), required=True)
    update_dashboard_layout = graphene.Field(
        DashboardObject, dashboard_id=graphene.ID(required=True), layout=JSON(required=True), required=True
    )

    def resolve_create_dataset(root, info, name):
        return Dataset.objects.create(name=name)

    def resolve_build_dataset(root, info, id):
        return Dataset.build(id)

    def resolve_create_dashboard(root, info, name, dataset_id):
        return Dashboard.objects.create(name=name, dataset_id=dataset_id)

    def resolve_delete_widget(root, info, widget_id):
        widget = Widget.objects.get(pk=widget_id)
        widget.delete()
        return widget.dashboard

    def resolve_update_dashboard_layout(root, info, dashboard_id, layout):
        dashboard = Dashboard.objects.get(pk=dashboard_id)
        dashboard.layout = layout
        dashboard.save()
        return dashboard


###################
# Schema definition
###################

schema = graphene.Schema(query=Query, mutation=Mutation)
