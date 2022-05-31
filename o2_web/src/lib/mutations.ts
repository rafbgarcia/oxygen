import { gql } from "@apollo/client"

export const mutations = {
  createDataset: gql`
    mutation createDataset($name: String!) {
      createDataset(name: $name) {
        dataset {
          id
          name
        }
      }
    }
  `,
}
