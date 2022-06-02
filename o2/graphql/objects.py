

import graphene
from graphene_django import DjangoObjectType
from o2.models import Dataset, DatasetTable, Dashboard, Widget

class DatasetTableFieldsObject(graphene.ObjectType):
    name = graphene.String(required=True)
    type = graphene.String(required=True)

    class Meta:
        name = "DatasetTableFields"


class DatasetTableObject(DjangoObjectType):
    fields = graphene.List(graphene.NonNull(DatasetTableFieldsObject), required=True)

    class Meta:
        model = DatasetTable
        name = model.__name__


class DatasetObject(DjangoObjectType):
    size_mb = graphene.Float()

    class Meta:
        model = Dataset
        name = model.__name__


class WidgetLayoutObject(graphene.ObjectType):
    i = graphene.ID(description="Unique ID to be used as the JSX element `key` prop", required=True)
    w = graphene.Int(description="Width", required=True)
    h = graphene.Int(description="Height", required=True)
    x = graphene.Int(description="X-axis position", required=True)
    y = graphene.Int(description="Y-axis position", required=True)

    class Meta:
        name = "WidgetLayout"


class DashboardObject(DjangoObjectType):
    class Meta:
        model = Dashboard
        name = model.__name__


class WidgetObject(DjangoObjectType):
    layout = graphene.NonNull(WidgetLayoutObject)

    class Meta:
        model = Widget
        name = model.__name__
