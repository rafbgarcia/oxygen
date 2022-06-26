import graphene
from oracle.graphql.types import JSON
from oracle.models.dashboard import Dashboard

from oracle.graphql.objects import DashboardObject, WidgetObject


class WidgetLayoutInput(graphene.InputObjectType):
    w = graphene.Int(required=True)
    h = graphene.Int(required=True)
    x = graphene.Int(required=True)
    y = graphene.Int(required=True)


class CreateWidgetMutationHandler(graphene.Mutation):
    class Arguments:
        dashboard_id = graphene.ID(required=True)
        widget_type = WidgetObject._meta.fields["type"].type
        build_info = JSON(required=True)
        layout = graphene.Argument(WidgetLayoutInput, required=True)

    dashboard = graphene.Field(DashboardObject, required=True)
    widget = graphene.Field(WidgetObject, required=True)

    def mutate(root, info, dashboard_id, widget_type, layout, build_info):
        dashboard = Dashboard.objects.get(pk=dashboard_id)
        widget = dashboard.widgets.create(type=widget_type, build_info=build_info)

        dashboard.layout.append({**layout, "i": widget.id})
        dashboard.save()
        return CreateWidgetMutationHandler(dashboard=dashboard, widget=widget)
