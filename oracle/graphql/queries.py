import graphene
from oracle.graphql.query_widget import WidgetQuery
from oracle.models.dashboard import Dashboard
from oracle.models.dataset import Dataset
from oracle.graphql.objects import DatasetObject, DashboardObject, WidgetObject


class DatasetQuery(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    Output = graphene.NonNull(DatasetObject)

    def mutate(root, info, id):
        return Dataset.objects.get(pk=id)


class Query(graphene.ObjectType):
    dataset = DatasetQuery.Field()
    datasets = graphene.List(graphene.NonNull(DatasetObject), required=True)
    dashboard = graphene.Field(DashboardObject, id=graphene.ID(required=True), required=True)
    dashboards = graphene.List(graphene.NonNull(DashboardObject), required=True)
    widget = WidgetQuery.Field()

    def resolve_datasets(root, info):
        return Dataset.objects.prefetch_related("tables").all()

    def resolve_dashboard(root, info, id):
        return Dashboard.objects.prefetch_related("widgets").get(pk=id)

    def resolve_dashboards(root, info):
        return Dashboard.objects.prefetch_related("widgets").all()
