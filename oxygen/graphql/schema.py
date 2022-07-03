import graphene
from oxygen.graphql.mutations import Mutation
from oxygen.graphql.queries import Query

schema = graphene.Schema(query=Query, mutation=Mutation)
