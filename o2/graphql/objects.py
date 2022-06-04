import graphene
from graphene_django import DjangoObjectType
from o2.graphql.types.json import JSON
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


# #
# # renderData UNION
# #


# class PivotTableRenderData(graphene.ObjectType):
#     html = graphene.String()


# class WidgetRenderData(graphene.Union):
#     class Meta:
#         types = (PivotTableRenderData,)


# #
# # buildInfo UNION
# #
# class PivotTableBuildInfoField(graphene.ObjectType):
#     tableId = graphene.ID()
#     name = graphene.String()
#     alias = graphene.String()
#     agg = graphene.String()


# class PivotTableBuildInfo(graphene.ObjectType):
#     rows = graphene.List(PivotTableBuildInfoField, required=True)
#     values = graphene.List(PivotTableBuildInfoField, required=True)
#     columns = graphene.List(PivotTableBuildInfoField, required=True)


# class VerticalBarChartBuildInfo(graphene.ObjectType):
#     categories = graphene.List(PivotTableBuildInfoField)
#     values = graphene.List(PivotTableBuildInfoField)
#     breakby = graphene.List(PivotTableBuildInfoField)


# class WidgetBuildInfo(graphene.Union):
#     class Meta:
#         types = (PivotTableBuildInfo, VerticalBarChartBuildInfo)


class WidgetObject(DjangoObjectType):
    build_info = graphene.Field(JSON)
    render_data = graphene.Field(JSON)

    class Meta:
        model = Widget
        name = model.__name__

    # def resolve_build_info(widget, info):
    #     return PivotTableBuildInfo(**widget.build_info)

    def resolve_render_data(widget, info):
        return widget.metadata(widget.dashboard.dataset)
