import graphene
from graphene_django import DjangoObjectType
from o2.graphql.types.json import JSON
from o2.models import Dataset, DatasetTable, Dashboard, DatasetTableColumn, Widget
from o2.widgets.builder import build_widget


class DatasetTableColumnObject(DjangoObjectType):
    class Meta:
        model = DatasetTableColumn
        name = model.__name__


class DatasetTableObject(DjangoObjectType):
    class Meta:
        model = DatasetTable
        name = model.__name__


class DatasetObject(DjangoObjectType):
    size_mb = graphene.Float()

    class Meta:
        model = Dataset
        name = model.__name__


class DashboardLayoutObject(graphene.ObjectType):
    i = graphene.ID(description="Unique ID to be used as the JSX element `key` prop", required=True)
    w = graphene.Int(description="Width", required=True)
    h = graphene.Int(description="Height", required=True)
    x = graphene.Int(description="X-axis position", required=True)
    y = graphene.Int(description="Y-axis position", required=True)

    class Meta:
        name = "DashboardLayout"


class DashboardObject(DjangoObjectType):
    layout = graphene.List(DashboardLayoutObject)

    class Meta:
        model = Dashboard
        name = model.__name__


class WidgetObject(DjangoObjectType):
    build_info = graphene.Field(JSON)
    render_data = graphene.Field(JSON)

    class Meta:
        model = Widget
        name = model.__name__

    def resolve_render_data(widget, info):
        return build_widget(widget)
