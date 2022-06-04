from sqlalchemy import table, column, select, func, cast, Float
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

        columns = build_info["columns"]
        pivot = Pivot.build(dataset, build_info)
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
        pivot = df.pivot(columns=columns, values=values, index=rows).fillna("-")

        return pivot


CONTRIBUTION = "CONTRIBUTION"
NEED_CTE_FUNCTIONS = [CONTRIBUTION]
AGG_FN = {
    "COUNT DISTINCT": lambda col: func.count(func.distinct(col)),
    "COUNT": lambda col: func.count(col),
    "SUM": lambda col: func.sum(col),
}


def _define_table(datasetTable):
    columns = [column(field["name"]) for field in datasetTable.fields]
    return table(datasetTable.name, *columns)


def _need_cte(field):
    return "function" in field and field["function"] in NEED_CTE_FUNCTIONS


def _aliased_col(table, field):
    return getattr(table.c, field["name"]).label(field["alias"])


def _table_cols(table, fields):
    return [_table_col(table, field) for field in fields]


def _table_col(table, field):
    return getattr(table.c, field["name"])


def _cte_field_alias(field):
    return field["agg"] + "_" + field["function"] + "_" + field["alias"]


def _build_agg(table, field):
    if field["agg"] not in AGG_FN:
        raise ValueNotSupported("Aggregation", field["agg"])

    return AGG_FN[field["agg"]](_table_col(table, field)).label(field["alias"])


def _cte_select_cols(table, ctes, build_info):
    cte_fields = [field for field in build_info["values"] if _need_cte(field)]

    cte_cols = []
    for field in cte_fields:
        cte = ctes[_cte_field_alias(field)]
        col = _build_agg(table, field)
        cte_col = getattr(cte.c, _cte_field_alias(field))
        derived_col = col / func.max(cte_col)
        cte_cols.append(derived_col.label(field["alias"]))
    return cte_cols


def _build_ctes(table, build_info):
    cte_fields = [field for field in build_info["values"] if _need_cte(field)]
    rows = build_info["rows"]

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


def _build_sql(dataset, build_info):
    table = _define_table(dataset.tables.first())
    rows = build_info["rows"]
    values = build_info["values"]
    columns = build_info["columns"]

    def ctes():
        """
        Common Table Expressions are used to:
        - Calculate percentages for CONTRIBUTION fields
        """
        return _build_ctes(table, build_info)

    def select_cols(ctes):
        rows_cols = [_aliased_col(table, field) for field in rows]
        columns_cols = [_aliased_col(table, field) for field in columns]
        agg_without_function_cols = [_build_agg(table, field) for field in values if not _need_cte(field)]
        agg_with_function_cols = _cte_select_cols(table, ctes, build_info)
        return rows_cols + columns_cols + agg_without_function_cols + agg_with_function_cols

    def group_by_cols():
        rows_groupby = _table_cols(table, rows)
        columns_groupby = _table_cols(table, columns)
        return rows_groupby + columns_groupby

    groupby_cols = group_by_cols()
    query = select(*select_cols(ctes())).group_by(*groupby_cols).order_by(*groupby_cols)
    # return str(query.compile(dialect=postgresql.dialect()))
    return str(query.compile())
