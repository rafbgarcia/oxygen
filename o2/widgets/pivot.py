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


def _define_tables(tables_with_fks, tables_without_fks):
    without_fks = {table.id: _define_table(table) for table in tables_without_fks}
    with_fks = {table.id: _define_table(table, without_fks) for table in tables_with_fks}
    return {**without_fks, **with_fks}


def _define_table(datasetTable, tables=[]):
    columns = list()

    for column in datasetTable.columns.all():
        if column.foreign_key:
            fk = tables[column.foreign_key.table_id].c[column.foreign_key.name]
            columns.append(Column(column.name, None, ForeignKey(fk)))
        else:
            columns.append(Column(column.name))

    return Table(datasetTable.name, MetaData(), *columns)


def _aliased_col(tables, field):
    return getattr(tables[field["table_id"]].c, field["name"]).label(field["alias"])


def _build_dimensions(tables, build_info):
    rows = [_aliased_col(tables, field) for field in build_info["rows"]]
    columns = [_aliased_col(tables, field) for field in build_info["columns"]]
    return rows, columns


def _build_measures(tables, build_info):
    values = list()
    for field in build_info["values"]:
        values.append(_build_agg2(tables, field))
    return values


def _build_agg2(tables, field):
    table_id, name, alias, agg = itemgetter("table_id", "name", "alias", "agg")(field)
    if agg not in AGG_FN:
        raise ValueNotSupported("Aggregation", agg)

    return AGG_FN[agg](tables[table_id].c[name]).label(alias)


def _select_from(tables, tables_with_fks):
    if len(tables_with_fks) == 0:
        return None

    # TODO: do not join tables
    # pode ter tabelas sem relacao e tabelas relacionadas
    ts = list(tables.values())
    joined = ts[0]
    for t in ts[1:]:
        joined = joined.join(t)
    return joined


def _build_sql(dataset, build_info):
    tables_with_fks = dataset.tables.distinct().filter(columns__foreign_key__isnull=False).all()
    tables_without_fks = dataset.tables.exclude(id__in=tables_with_fks).all()
    tables = _define_tables(tables_with_fks, tables_without_fks)

    rows, columns = _build_dimensions(tables, build_info)
    values = _build_measures(tables, build_info)

    select_columns = rows + columns + values
    select_from = _select_from(
        tables,
        tables_with_fks,
    )
    group_by_columns = rows + columns

    query = (
        select(*select_columns)
        .select_from(select_from)
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
