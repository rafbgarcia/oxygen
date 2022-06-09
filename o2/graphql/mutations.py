import graphene
from o2.graphql.mutation_createDataset import CreateDatasetMutationHandler
from o2.graphql.mutation_createDatasetTable import CreateDatasetTableMutationHandler
from o2.graphql.mutation_deleteRelation import DeleteRelationMutationHandler
from o2.graphql.mutation_updateRelation import UpdateRelationMutationHandler
from o2.graphql.mutation_updateWidgetBuildInfo import UpdateWidgetBuildInfoMutationHandler
from o2.graphql.types import JSON
from o2.models import Dashboard, Dataset, Widget
from o2.graphql.objects import DashboardObject

from o2.graphql.mutation_createWidget import CreateWidgetMutationHandler
from o2.graphql.mutation_buildDataset import BuildDatasetMutationHandler
from o2.graphql.mutation_updateColumn import UpdateColumnMutationHandler


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
