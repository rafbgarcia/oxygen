import graphene
from o2.graphql.types.json import JSON
from o2.models import Dashboard, Widget

from o2.graphql.objects import DashboardObject


class UpdateWidgetBuildInfoMutationHandler(graphene.Mutation):
    class Arguments:
        widget_id = graphene.ID(required=True)
        build_info = JSON(required=True)

    Output = DashboardObject

    @classmethod
    def mutate(cls, root, info, widget_id, build_info):
        widget = Widget.objects.get(pk=widget_id)
        widget.build_info = build_info
        widget.save()

        dashboard = Dashboard.objects.prefetch_related("widgets").get(pk=widget.dashboard_id)
        return dashboard
