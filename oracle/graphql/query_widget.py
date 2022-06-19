import graphene
from oracle.graphql.types import JSON
from oracle.graphql.objects import WidgetObject
from oracle.widgets.widget_builder import WidgetBuilder


class WidgetQuery(graphene.Mutation):
    class Arguments:
        type = WidgetObject._meta.fields["type"].type
        dataset = JSON(required=True)
        build = JSON(required=True)

    Output = JSON

    def mutate(root, info, type, dataset, build):
        return WidgetBuilder.build(
            type=type,
            dataset=dataset,
            build=build,
        )
