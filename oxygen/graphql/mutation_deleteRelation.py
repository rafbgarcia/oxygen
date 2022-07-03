import graphene
from oxygen.models.dataset_relation import DatasetRelation


class DeleteRelationMutationHandler(graphene.Mutation):
    class Arguments:
        relation_id = graphene.ID(required=True)

    Output = graphene.Boolean

    def mutate(root, info, relation_id):
        DatasetRelation.objects.get(pk=relation_id).delete()
        return True
