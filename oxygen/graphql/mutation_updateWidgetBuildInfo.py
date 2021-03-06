import graphene
from oxygen.graphql.types import JSON
from oxygen.models.widget import Widget

from oxygen.graphql.objects import WidgetObject


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
