import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type CreateDatasetTableMutationHandler = {
  __typename?: 'CreateDatasetTableMutationHandler';
  dataset?: Maybe<Dataset>;
};

export type Dataset = {
  __typename?: 'Dataset';
  buildDurationSeconds?: Maybe<Scalars['Float']>;
  created: Scalars['DateTime'];
  id: Scalars['ID'];
  isBuilding: Scalars['Boolean'];
  lastBuiltAt?: Maybe<Scalars['DateTime']>;
  modified: Scalars['DateTime'];
  name: Scalars['String'];
  sizeMb?: Maybe<Scalars['Int']>;
  tables: Array<DatasetTable>;
};

export type DatasetTable = {
  __typename?: 'DatasetTable';
  dataset: Dataset;
  fields: Array<DatasetTableFields>;
  htmlPreview: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  query: Scalars['String'];
  totalRecords?: Maybe<Scalars['Int']>;
};

export type DatasetTableFields = {
  __typename?: 'DatasetTableFields';
  name: Scalars['String'];
  type: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createDataset: Dataset;
  createDatasetTable?: Maybe<CreateDatasetTableMutationHandler>;
};


export type MutationCreateDatasetArgs = {
  name: Scalars['String'];
};


export type MutationCreateDatasetTableArgs = {
  datasetId: Scalars['ID'];
  name: Scalars['String'];
  query: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  dataset: Dataset;
  datasets: Array<Dataset>;
};


export type QueryDatasetArgs = {
  id: Scalars['ID'];
};

export type DatasetPartsFragment = { __typename?: 'Dataset', id: string, name: string, sizeMb?: number | null, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview: string, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> }> };

export type DatasetTablePartsFragment = { __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview: string, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> };

export type DatasetTableFieldsPartsFragment = { __typename?: 'DatasetTableFields', name: string, type: string };

export type CreateDatasetMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateDatasetMutation = { __typename?: 'Mutation', createDataset: { __typename?: 'Dataset', id: string, name: string, sizeMb?: number | null, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview: string, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> }> } };

export type CreateDatasetTableMutationVariables = Exact<{
  datasetId: Scalars['ID'];
  name: Scalars['String'];
  query: Scalars['String'];
}>;


export type CreateDatasetTableMutation = { __typename?: 'Mutation', createDatasetTable?: { __typename?: 'CreateDatasetTableMutationHandler', dataset?: { __typename?: 'Dataset', id: string, name: string, sizeMb?: number | null, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview: string, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> }> } | null } | null };

export type DatasetQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DatasetQuery = { __typename?: 'Query', dataset: { __typename?: 'Dataset', id: string, name: string, sizeMb?: number | null, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview: string, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> }> } };

export type DatasetsQueryVariables = Exact<{ [key: string]: never; }>;


export type DatasetsQuery = { __typename?: 'Query', datasets: Array<{ __typename?: 'Dataset', id: string, name: string, sizeMb?: number | null, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview: string, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> }> }> };

export const DatasetTableFieldsPartsFragmentDoc = /*#__PURE__*/ gql`
    fragment DatasetTableFieldsParts on DatasetTableFields {
  name
  type
}
    `;
export const DatasetTablePartsFragmentDoc = /*#__PURE__*/ gql`
    fragment DatasetTableParts on DatasetTable {
  id
  name
  query
  totalRecords
  htmlPreview
  fields {
    ...DatasetTableFieldsParts
  }
}
    ${DatasetTableFieldsPartsFragmentDoc}`;
export const DatasetPartsFragmentDoc = /*#__PURE__*/ gql`
    fragment DatasetParts on Dataset {
  id
  name
  sizeMb
  lastBuiltAt
  tables {
    ...DatasetTableParts
  }
}
    ${DatasetTablePartsFragmentDoc}`;
export const CreateDatasetDocument = /*#__PURE__*/ gql`
    mutation createDataset($name: String!) {
  createDataset(name: $name) {
    ...DatasetParts
  }
}
    ${DatasetPartsFragmentDoc}`;
export type CreateDatasetMutationFn = Apollo.MutationFunction<CreateDatasetMutation, CreateDatasetMutationVariables>;

/**
 * __useCreateDatasetMutation__
 *
 * To run a mutation, you first call `useCreateDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDatasetMutation, { data, loading, error }] = useCreateDatasetMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateDatasetMutation(baseOptions?: Apollo.MutationHookOptions<CreateDatasetMutation, CreateDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDatasetMutation, CreateDatasetMutationVariables>(CreateDatasetDocument, options);
      }
export type CreateDatasetMutationHookResult = ReturnType<typeof useCreateDatasetMutation>;
export type CreateDatasetMutationResult = Apollo.MutationResult<CreateDatasetMutation>;
export type CreateDatasetMutationOptions = Apollo.BaseMutationOptions<CreateDatasetMutation, CreateDatasetMutationVariables>;
export const CreateDatasetTableDocument = /*#__PURE__*/ gql`
    mutation createDatasetTable($datasetId: ID!, $name: String!, $query: String!) {
  createDatasetTable(datasetId: $datasetId, name: $name, query: $query) {
    dataset {
      ...DatasetParts
    }
  }
}
    ${DatasetPartsFragmentDoc}`;
export type CreateDatasetTableMutationFn = Apollo.MutationFunction<CreateDatasetTableMutation, CreateDatasetTableMutationVariables>;

/**
 * __useCreateDatasetTableMutation__
 *
 * To run a mutation, you first call `useCreateDatasetTableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDatasetTableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDatasetTableMutation, { data, loading, error }] = useCreateDatasetTableMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      name: // value for 'name'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useCreateDatasetTableMutation(baseOptions?: Apollo.MutationHookOptions<CreateDatasetTableMutation, CreateDatasetTableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDatasetTableMutation, CreateDatasetTableMutationVariables>(CreateDatasetTableDocument, options);
      }
export type CreateDatasetTableMutationHookResult = ReturnType<typeof useCreateDatasetTableMutation>;
export type CreateDatasetTableMutationResult = Apollo.MutationResult<CreateDatasetTableMutation>;
export type CreateDatasetTableMutationOptions = Apollo.BaseMutationOptions<CreateDatasetTableMutation, CreateDatasetTableMutationVariables>;
export const DatasetDocument = /*#__PURE__*/ gql`
    query dataset($id: ID!) {
  dataset(id: $id) {
    ...DatasetParts
  }
}
    ${DatasetPartsFragmentDoc}`;

/**
 * __useDatasetQuery__
 *
 * To run a query within a React component, call `useDatasetQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatasetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatasetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDatasetQuery(baseOptions: Apollo.QueryHookOptions<DatasetQuery, DatasetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DatasetQuery, DatasetQueryVariables>(DatasetDocument, options);
      }
export function useDatasetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatasetQuery, DatasetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DatasetQuery, DatasetQueryVariables>(DatasetDocument, options);
        }
export type DatasetQueryHookResult = ReturnType<typeof useDatasetQuery>;
export type DatasetLazyQueryHookResult = ReturnType<typeof useDatasetLazyQuery>;
export type DatasetQueryResult = Apollo.QueryResult<DatasetQuery, DatasetQueryVariables>;
export const DatasetsDocument = /*#__PURE__*/ gql`
    query datasets {
  datasets {
    ...DatasetParts
  }
}
    ${DatasetPartsFragmentDoc}`;

/**
 * __useDatasetsQuery__
 *
 * To run a query within a React component, call `useDatasetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatasetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatasetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDatasetsQuery(baseOptions?: Apollo.QueryHookOptions<DatasetsQuery, DatasetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DatasetsQuery, DatasetsQueryVariables>(DatasetsDocument, options);
      }
export function useDatasetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatasetsQuery, DatasetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DatasetsQuery, DatasetsQueryVariables>(DatasetsDocument, options);
        }
export type DatasetsQueryHookResult = ReturnType<typeof useDatasetsQuery>;
export type DatasetsLazyQueryHookResult = ReturnType<typeof useDatasetsLazyQuery>;
export type DatasetsQueryResult = Apollo.QueryResult<DatasetsQuery, DatasetsQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    