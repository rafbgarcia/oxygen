import graphene
from o2.graphql.types.json import JSON
from o2.models import Dashboard

from o2.graphql.objects import DashboardObject, WidgetObject


class WidgetLayoutInput(graphene.InputObjectType):
    i = graphene.ID(required=True)
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

    @classmethod
    def mutate(cls, root, info, dashboard_id, widget_type, layout, build_info):
        dashboard = Dashboard.objects.get(pk=dashboard_id)
        widget = dashboard.widgets.create(type=widget_type, layout=layout, build_info=build_info)
        return CreateWidgetMutationHandler(dashboard=dashboard, widget=widget)
