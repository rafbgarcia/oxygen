from graphene.types import Scalar
from graphql.language import ast


class JSON(Scalar):
    """
    A JSON payload. Details would not be type checked.
    In general, an actual GraphQL type describing the
    contents of what's inside the JSON data is preferable.
    """

    @staticmethod
    def serialize(val):
        return val

    @staticmethod
    def parse_literal(node):
        return node.value

    @staticmethod
    def parse_value(value):
        return value
