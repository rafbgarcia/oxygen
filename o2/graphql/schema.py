import graphene
from o2.graphql.mutations import Mutation
from o2.graphql.queries import Query

schema = graphene.Schema(query=Query, mutation=Mutation)
