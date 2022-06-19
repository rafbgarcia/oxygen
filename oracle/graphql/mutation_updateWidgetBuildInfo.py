import graphene
from oracle.graphql.types import JSON
from oracle.models import Dashboard, Widget

from oracle.graphql.objects import DashboardObject, WidgetObject


class UpdateWidgetBuildInfoMutationHandler(graphene.Mutation):
    class Arguments:
        widget_id = graphene.ID(required=True)
        build_info = JSON(required=True)

    Output = WidgetObject

    def mutate(root, info, widget_id, build_info):
        widget = Widget.objects.get(pk=widget_id)
        widget.build_info = build_info
        widget.save()

        return widget
