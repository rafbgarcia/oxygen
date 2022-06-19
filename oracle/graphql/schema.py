import graphene
from oracle.graphql.mutations import Mutation
from oracle.graphql.queries import Query

schema = graphene.Schema(query=Query, mutation=Mutation)
