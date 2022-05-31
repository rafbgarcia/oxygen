import { gql } from "@apollo/client"

export const fragments = {
  datasetFields: gql`
    fragment DatasetFields on Dataset {
      id
      name
      sizeMb
      lastBuiltAt
      tables {
        id
        name
      }
    }
  `,
}
