import graphene
from oracle.graphql.mutation_createDataset import CreateDatasetMutationHandler
from oracle.graphql.mutation_createDatasetTable import CreateDatasetTableMutationHandler
from oracle.graphql.mutation_deleteRelation import DeleteRelationMutationHandler
from oracle.graphql.mutation_updateDatasetTable import UpdateDatasetTableMutationHandler
from oracle.graphql.mutation_updateRelation import UpdateRelationMutationHandler
from oracle.graphql.mutation_updateWidgetBuildInfo import UpdateWidgetBuildInfoMutationHandler
from oracle.graphql.types import JSON
from oracle.models.dashboard import Dashboard
from oracle.models.dataset import Dataset
from oracle.models.widget import Widget
from oracle.graphql.objects import DashboardObject

from oracle.graphql.mutation_createWidget import CreateWidgetMutationHandler
from oracle.graphql.mutation_buildDataset import BuildDatasetMutationHandler
from oracle.graphql.mutation_updateColumn import UpdateColumnMutationHandler


class Mutation(graphene.ObjectType):
    create_dataset = CreateDatasetMutationHandler.Field()
    build_dataset = BuildDatasetMutationHandler.Field()
    create_dataset_table = CreateDatasetTableMutationHandler.Field()
    update_column = UpdateColumnMutationHandler.Field()
    update_relation = UpdateRelationMutationHandler.Field()
    delete_relation = DeleteRelationMutationHandler.Field()

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
    update_dataset_table = UpdateDatasetTableMutationHandler.Field()

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
