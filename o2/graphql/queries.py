import graphene
from o2.models import Dashboard, Dataset
from o2.graphql.objects import DatasetObject, DashboardObject, WidgetObject


class Query(graphene.ObjectType):
    dataset = graphene.Field(DatasetObject, id=graphene.ID(required=True), required=True)
    datasets = graphene.List(graphene.NonNull(DatasetObject), required=True)
    dashboard = graphene.Field(DashboardObject, id=graphene.ID(required=True), required=True)
    dashboards = graphene.List(graphene.NonNull(DashboardObject), required=True)

    def resolve_dataset(root, info, id):
        return Dataset.objects.get(pk=id)

    def resolve_datasets(root, info):
        return Dataset.objects.prefetch_related("tables").all()

    def resolve_dashboard(root, info, id):
        return Dashboard.objects.prefetch_related("widgets").get(pk=id)

    def resolve_dashboards(root, info):
        return Dashboard.objects.prefetch_related("widgets").all()
