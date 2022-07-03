import graphene
from graphene_django import DjangoObjectType
from oxygen.graphql.types import JSON
from oxygen.models.dataset import Dataset
from oxygen.models.dataset_relation import DatasetRelation
from oxygen.models.dataset_table import DatasetTable
from oxygen.models.dashboard import Dashboard
from oxygen.models.dataset_table_column import DatasetTableColumn
from oxygen.models.widget import Widget


class DatasetObject(DjangoObjectType):
    class Meta:
        model = Dataset
        name = model.__name__

    file_path = graphene.String()

    def resolve_file_path(dataset, info):
        return dataset.file_path()


class DatasetTableObject(DjangoObjectType):
    class Meta:
        model = DatasetTable
        name = model.__name__


class DatasetTableColumnObject(DjangoObjectType):
    class Meta:
        model = DatasetTableColumn
        name = model.__name__

    full_name = graphene.String()

    def resolve_full_name(column, info):
        return f"{column.table.name}.{column.name}"


class DatasetRelationObject(DjangoObjectType):
    class Meta:
        model = DatasetRelation
        name = model.__name__

    full_source = graphene.String()
    full_reference = graphene.String()

    def resolve_full_source(relation, info):
        return f"{relation.source_table}.{relation.source_column}"

    def resolve_full_reference(relation, info):
        return f"{relation.reference_table}.{relation.reference_column}"


class DashboardLayoutObject(graphene.ObjectType):
    class Meta:
        name = "DashboardLayout"

    i = graphene.ID(description="Unique ID to be used as the JSX element `key` prop", required=True)
    w = graphene.Int(description="Width", required=True)
    h = graphene.Int(description="Height", required=True)
    x = graphene.Int(description="X-axis position", required=True)
    y = graphene.Int(description="Y-axis position", required=True)


class DashboardObject(DjangoObjectType):
    class Meta:
        model = Dashboard
        name = model.__name__

    layout = graphene.List(DashboardLayoutObject)


class WidgetObject(DjangoObjectType):
    class Meta:
        model = Widget
        name = model.__name__

    build_info = graphene.Field(JSON)
