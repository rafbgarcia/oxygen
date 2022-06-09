import graphene
from o2.graphql.types import JSON
from o2.graphql.objects import WidgetObject
from o2.widgets.widget_builder import WidgetBuilder


class WidgetQuery(graphene.Mutation):
    class Arguments:
        type = WidgetObject._meta.fields["type"].type
        dataset = JSON(required=True)
        build = JSON(required=True)

    Output = graphene.NonNull(JSON)

    def mutate(root, info, type, dataset, build):
        return WidgetBuilder.build(
            type=type,
            dataset=dataset,
            build=build,
        )
