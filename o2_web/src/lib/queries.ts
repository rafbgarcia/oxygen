import { gql } from "@apollo/client"
import { fragments } from "./fragments"

export const queries = {
  datasets: gql`
    ${fragments.datasetFields}
    query datasets {
      datasets {
        ...DatasetFields
      }
    }
  `,
  dataset: gql`
    ${fragments.datasetFields}
    query dataset($id: ID!) {
      dataset(id: $id) {
        ...DatasetFields
      }
    }
  `,
}
