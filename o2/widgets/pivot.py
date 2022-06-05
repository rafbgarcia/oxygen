from copy import deepcopy
from operator import itemgetter
from sqlalchemy import (
    ForeignKey,
    ForeignKeyConstraint,
    MetaData,
    table as makeTable,
    column,
    select,
    func,
    cast,
    Float,
    Table,
    Column,
)
from sqlalchemy.dialects import postgresql
from o2.errors import ValueNotSupported
from o2.models import DatasetTable, DatasetTableColumn


class Pivot:
    @staticmethod
    def has_required_attrs(build_info):
        return len(build_info["values"]) > 0 and (
            len(build_info["rows"]) > 0 or len(build_info["columns"]) > 0
        )

    @staticmethod
    def metadata(dataset, build_info, limit=25, offset=0):
        if not Pivot.has_required_attrs(build_info):
            return None

        pivot = Pivot.build(dataset, build_info)
        columns = build_info["columns"]
        if len(columns) > 0:
            # Swap the first column with the values table row
            pivot = pivot.swaplevel(0, len(columns), axis="columns").sort_index(axis="columns")

        return {"html": pivot[offset:limit].to_html(escape=False, na_rep="-", index_names=True)}

    @staticmethod
    def build(dataset, build_info):
        query = _build_sql(dataset, build_info)
        rows = [field["alias"] for field in build_info["rows"]]
        values = [field["alias"] for field in build_info["values"]]
        columns = [field["alias"] for field in build_info["columns"]]

        df = dataset.execute(query)
        pivot = df.pivot(columns=columns, values=values, index=rows)

        return pivot


CONTRIBUTION = "CONTRIBUTION"
NEED_CTE_FUNCTIONS = [CONTRIBUTION]
AGG_FN = {
    "COUNT DISTINCT": lambda col: func.count(func.distinct(col)),
    "COUNT": lambda col: func.count(col),
    "SUM": lambda col: func.sum(col),
}


def _need_cte(field):
    return "function" in field and field["function"] in NEED_CTE_FUNCTIONS


def _table_cols(tables, fields):
    return [_table_col(tables, field) for field in fields]


def _table_col(tables, field):
    return getattr(tables[field["table_id"]].c, field["name"])


def _cte_field_alias(field):
    return field["alias"]


def _build_agg(table, field):
    if field["agg"] not in AGG_FN:
        raise ValueNotSupported("Aggregation", field["agg"])

    return AGG_FN[field["agg"]](_table_col(table, field)).label(field["alias"])


def _cte_select_cols(table, ctes, values):
    cte_fields = [field for field in values if _need_cte(field)]

    cte_cols = []
    for field in cte_fields:
        cte = ctes[_cte_field_alias(field)]
        col = _build_agg(table, field)
        cte_col = getattr(cte.c, _cte_field_alias(field))
        derived_col = col / func.max(cte_col)
        cte_cols.append(derived_col.label(field["alias"]))
    return cte_cols


def _build_ctes(table, rows, values):
    cte_fields = [field for field in values if _need_cte(field)]
    rows = rows

    def grouped_totals_cte():
        rows_cols = _table_cols(table, rows)
        fn_cols = [_build_agg(table, field).label(_cte_field_alias(field)) for field in cte_fields]
        return select(*rows_cols, *fn_cols).group_by(*rows_cols).cte()

    def summed_totals_cte(grouped_totals_cte):
        fn_cols = []
        for field in cte_fields:
            col = getattr(grouped_totals_cte.c, _cte_field_alias(field))
            col = cast(func.sum(col), Float).label(_cte_field_alias(field))
            fn_cols.append(col)

        rows_minus_last = _table_cols(grouped_totals_cte, rows[0:-1])
        return select(*rows_minus_last, *fn_cols).group_by(*rows_minus_last).cte()

    cte = summed_totals_cte(grouped_totals_cte())
    return {_cte_field_alias(field): cte for field in cte_fields}


### new code


def _columns_map(tables_with_fks, tables_without_fks):
    without_fks = {}
    for table in tables_without_fks:
        without_fks.update(_define_table(table, {}))

    with_fks = {}
    for table in tables_with_fks:
        with_fks.update(_define_table(table, without_fks))

    return {**without_fks, **with_fks}


def _define_table(dataset_table, columns_map):
    columns = dict()
    dataset_cols = dataset_table.columns.all()
    for column in dataset_cols:
        if column.foreign_key:
            fk = columns_map[column.foreign_key_id]
            columns[column.id] = Column(column.name, None, ForeignKey(fk))
        else:
            columns[column.id] = Column(column.name)

    table = Table(dataset_table.name, MetaData(), *columns.values())
    return {col.id: columns[col.id] for col in dataset_cols}


def _aliased_col(columns, field):
    return columns[field["column_id"]].label(field["alias"])


def _build_dimensions(columns, fields):
    return [_aliased_col(columns, field) for field in fields]


def _build_measures(columns, values):
    measures = list()
    for field in values:
        measures.append(_build_agg2(columns, field))
    return measures


def _build_agg2(columns_map, field):
    column_id, alias, agg = itemgetter("column_id", "alias", "agg")(field)
    if agg not in AGG_FN:
        raise ValueNotSupported("Aggregation", agg)

    return AGG_FN[agg](columns_map[column_id]).label(alias)


def _select_from(tables, cols_map):
    if len(tables) == 1:
        return []

    relations = list(
        DatasetTableColumn.objects.filter(table_id__in=tables).filter(foreign_key__isnull=False).all()
    )
    table1 = cols_map[relations[0].id].table
    join1 = cols_map[relations[0].foreign_key_id].table
    joins = table1.join(join1)
    return [joins]


def _build_sql(dataset, build_info):
    rows, values, columns = itemgetter("rows", "values", "columns")(build_info)
    column_ids = list(map(itemgetter("column_id"), rows + values + columns))

    tables_with_fks = (
        dataset.tables.distinct()
        .filter(columns__foreign_key__isnull=False)
        .filter(columns__id__in=column_ids)
        .all()
    )
    tables_without_fks = (
        dataset.tables.exclude(id__in=tables_with_fks).filter(columns__id__in=column_ids).all()
    )
    columns_map = _columns_map(tables_with_fks, tables_without_fks)

    rows_columns = _build_dimensions(columns_map, rows + columns)
    values = _build_measures(columns_map, build_info["values"])

    select_columns = rows_columns + values
    select_from = _select_from(list(tables_with_fks) + list(tables_without_fks), columns_map)
    group_by_columns = rows_columns

    query = (
        select(*select_columns)
        .select_from(*select_from)
        .group_by(*group_by_columns)
        .order_by(*group_by_columns)
    )

    return str(query.compile())

    # def ctes():
    #     """
    #     Common Table Expressions are used to:
    #     - Calculate percentages for CONTRIBUTION fields
    #     """
    #     return _build_ctes(fields)
