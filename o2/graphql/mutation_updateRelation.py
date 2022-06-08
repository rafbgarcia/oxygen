import graphene
from o2.graphql.objects import DatasetRelationObject
from o2.models import DatasetRelation


class Ok(graphene.ObjectType):
    ok = graphene.Boolean()


class UpdateRelationMutationHandler(graphene.Mutation):
    class Arguments:
        dataset_id = graphene.ID()
        current_relation_id = graphene.ID()
        full_source = graphene.String()
        full_reference = graphene.String()

    Output = DatasetRelationObject

    def mutate(
        root,
        info,
        dataset_id=None,
        current_relation_id=None,
        full_source=None,
        full_reference=None,
    ):
        [source_table, source_column] = full_source.split(".")
        [reference_table, reference_column] = full_reference.split(".")

        if current_relation_id:
            relation = DatasetRelation.objects.get(pk=current_relation_id)
        else:
            relation = DatasetRelation(dataset_id=dataset_id)

        relation.source_table = source_table
        relation.source_column = source_column
        relation.reference_table = reference_table
        relation.reference_column = reference_column
        relation.save()

        return relation
