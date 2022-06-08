class SQLBuilder:
    class Column:
        def __init__(self, formula, alias, **_kargs):
            self.formula = formula
            self.alias = alias

    @staticmethod
    def build(dimensions, measures, tables, relations):
        used_tables = _used_tables(tables, dimensions + measures)
        where_clauses = ["1=1"] + _join_where(used_tables, relations)

        select_columns = ", ".join(_select(dimensions + measures))
        from_tables = ", ".join([table.name for table in used_tables])
        where = " AND ".join(where_clauses)
        groupby = ", ".join(_groupby(dimensions))
        orderby = ", ".join(_orderby(dimensions))

        return " ".join(
            [
                "SELECT",
                select_columns,
                "FROM",
                from_tables,
                "WHERE",
                where,
                "GROUP BY",
                groupby,
                "ORDER BY",
                orderby,
            ]
        )


def _relation_where(relation):
    return f"{relation.source_table}.{relation.source_column} = {relation.reference_table}.{relation.reference_column}"


def _select(columns):
    select = list()
    for column in columns:
        select.append(column.formula + f' AS "{column.alias}"')

    return select


def _used_tables(tables, columns):
    return list(set([table for table in tables for column in columns if table.name in column.formula]))


def _join_where(used_tables, relations):
    if len(used_tables) == 1:
        return []

    used_relations = [
        relation for table in used_tables for relation in relations if table.name == relation.source_table
    ]

    return [_relation_where(relation) for relation in used_relations]


def _groupby(columns):
    return [column.formula for column in columns]


def _orderby(columns):
    return [column.formula for column in columns]
