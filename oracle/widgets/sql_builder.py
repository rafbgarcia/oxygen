class SQLBuilder:
    class Table:
        def __init__(self, name, **_kargs):
            self.name = name

    class Relation:
        def __init__(self, full_source, full_reference, **_kargs):
            self.full_source = full_source
            self.full_reference = full_reference

        def where_clause(self):
            return f"{self.full_source} = {self.full_reference}"

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
        relation for table in used_tables for relation in relations if table.name in relation.full_source
    ]

    return [relation.where_clause() for relation in used_relations]


def _groupby(columns):
    return [column.formula for column in columns]


def _orderby(columns):
    return [column.formula for column in columns]
