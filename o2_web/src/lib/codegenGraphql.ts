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
  JSONString: any;
};

export type Dashboard = {
  __typename?: 'Dashboard';
  created: Scalars['DateTime'];
  dataset?: Maybe<Dataset>;
  id: Scalars['ID'];
  layout?: Maybe<Scalars['JSONString']>;
  modified: Scalars['DateTime'];
  name: Scalars['String'];
  widgets: Array<Widget>;
};

export type Dataset = {
  __typename?: 'Dataset';
  buildDurationSeconds?: Maybe<Scalars['Int']>;
  created: Scalars['DateTime'];
  dashboardSet: Array<Dashboard>;
  id: Scalars['ID'];
  isBuilding?: Maybe<Scalars['Boolean']>;
  lastBuiltAt?: Maybe<Scalars['DateTime']>;
  modified: Scalars['DateTime'];
  name: Scalars['String'];
  sizeMb?: Maybe<Scalars['Float']>;
  tables: Array<DatasetTable>;
};

export type DatasetTable = {
  __typename?: 'DatasetTable';
  dataset: Dataset;
  fields: Array<DatasetTableFields>;
  htmlPreview?: Maybe<Scalars['String']>;
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
  buildDataset: Dataset;
  createDashboard: Dashboard;
  createDataset: Dataset;
  createDatasetTable?: Maybe<Dataset>;
};


export type MutationBuildDatasetArgs = {
  id: Scalars['ID'];
};


export type MutationCreateDashboardArgs = {
  datasetId: Scalars['ID'];
  name: Scalars['String'];
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
  dashboard: Dashboard;
  dashboards: Array<Dashboard>;
  dataset: Dataset;
  datasets: Array<Dataset>;
};


export type QueryDashboardArgs = {
  id: Scalars['ID'];
};


export type QueryDatasetArgs = {
  id: Scalars['ID'];
};

export type Widget = {
  __typename?: 'Widget';
  buildInfo: Scalars['JSONString'];
  created: Scalars['DateTime'];
  dashboard: Dashboard;
  gridRowIndex: Scalars['Int'];
  id: Scalars['ID'];
  modified: Scalars['DateTime'];
  title?: Maybe<Scalars['String']>;
  type: WidgetType;
};

export enum WidgetType {
  LineChart = 'LINE_CHART',
  PivotTable = 'PIVOT_TABLE',
  VerticalBarChart = 'VERTICAL_BAR_CHART'
}

export type DashboardPartsFragment = { __typename?: 'Dashboard', id: string, name: string, layout?: any | null };

export type DatasetPartsFragment = { __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview?: string | null, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> }> };

export type DatasetTablePartsFragment = { __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview?: string | null, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> };

export type DatasetTableFieldsPartsFragment = { __typename?: 'DatasetTableFields', name: string, type: string };

export type BuildDatasetMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type BuildDatasetMutation = { __typename?: 'Mutation', dataset: { __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview?: string | null, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> }> } };

export type CreateDashboardMutationVariables = Exact<{
  name: Scalars['String'];
  datasetId: Scalars['ID'];
}>;


export type CreateDashboardMutation = { __typename?: 'Mutation', dashboard: { __typename?: 'Dashboard', id: string, name: string, layout?: any | null } };

export type CreateDatasetMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateDatasetMutation = { __typename?: 'Mutation', dataset: { __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview?: string | null, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> }> } };

export type CreateDatasetTableMutationVariables = Exact<{
  datasetId: Scalars['ID'];
  name: Scalars['String'];
  query: Scalars['String'];
}>;


export type CreateDatasetTableMutation = { __typename?: 'Mutation', dataset?: { __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview?: string | null, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> }> } | null };

export type DashboardQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DashboardQuery = { __typename?: 'Query', dashboard: { __typename?: 'Dashboard', id: string, name: string, layout?: any | null } };

export type DashboardsQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardsQuery = { __typename?: 'Query', dashboards: Array<{ __typename?: 'Dashboard', id: string, name: string, layout?: any | null }> };

export type DatasetQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DatasetQuery = { __typename?: 'Query', dataset: { __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview?: string | null, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> }> } };

export type DatasetsQueryVariables = Exact<{ [key: string]: never; }>;


export type DatasetsQuery = { __typename?: 'Query', datasets: Array<{ __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, query: string, totalRecords?: number | null, htmlPreview?: string | null, fields: Array<{ __typename?: 'DatasetTableFields', name: string, type: string }> }> }> };

export const DashboardPartsFragmentDoc = /*#__PURE__*/ gql`
    fragment DashboardParts on Dashboard {
  id
  name
  layout
}
    `;
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
  lastBuiltAt
  tables {
    ...DatasetTableParts
  }
}
    ${DatasetTablePartsFragmentDoc}`;
export const BuildDatasetDocument = /*#__PURE__*/ gql`
    mutation buildDataset($id: ID!) {
  dataset: buildDataset(id: $id) {
    ...DatasetParts
  }
}
    ${DatasetPartsFragmentDoc}`;
export type BuildDatasetMutationFn = Apollo.MutationFunction<BuildDatasetMutation, BuildDatasetMutationVariables>;

/**
 * __useBuildDatasetMutation__
 *
 * To run a mutation, you first call `useBuildDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBuildDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [buildDatasetMutation, { data, loading, error }] = useBuildDatasetMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useBuildDatasetMutation(baseOptions?: Apollo.MutationHookOptions<BuildDatasetMutation, BuildDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BuildDatasetMutation, BuildDatasetMutationVariables>(BuildDatasetDocument, options);
      }
export type BuildDatasetMutationHookResult = ReturnType<typeof useBuildDatasetMutation>;
export type BuildDatasetMutationResult = Apollo.MutationResult<BuildDatasetMutation>;
export type BuildDatasetMutationOptions = Apollo.BaseMutationOptions<BuildDatasetMutation, BuildDatasetMutationVariables>;
export const CreateDashboardDocument = /*#__PURE__*/ gql`
    mutation createDashboard($name: String!, $datasetId: ID!) {
  dashboard: createDashboard(name: $name, datasetId: $datasetId) {
    ...DashboardParts
  }
}
    ${DashboardPartsFragmentDoc}`;
export type CreateDashboardMutationFn = Apollo.MutationFunction<CreateDashboardMutation, CreateDashboardMutationVariables>;

/**
 * __useCreateDashboardMutation__
 *
 * To run a mutation, you first call `useCreateDashboardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDashboardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDashboardMutation, { data, loading, error }] = useCreateDashboardMutation({
 *   variables: {
 *      name: // value for 'name'
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useCreateDashboardMutation(baseOptions?: Apollo.MutationHookOptions<CreateDashboardMutation, CreateDashboardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDashboardMutation, CreateDashboardMutationVariables>(CreateDashboardDocument, options);
      }
export type CreateDashboardMutationHookResult = ReturnType<typeof useCreateDashboardMutation>;
export type CreateDashboardMutationResult = Apollo.MutationResult<CreateDashboardMutation>;
export type CreateDashboardMutationOptions = Apollo.BaseMutationOptions<CreateDashboardMutation, CreateDashboardMutationVariables>;
export const CreateDatasetDocument = /*#__PURE__*/ gql`
    mutation createDataset($name: String!) {
  dataset: createDataset(name: $name) {
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
  dataset: createDatasetTable(datasetId: $datasetId, name: $name, query: $query) {
    ...DatasetParts
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
export const DashboardDocument = /*#__PURE__*/ gql`
    query dashboard($id: ID!) {
  dashboard(id: $id) {
    ...DashboardParts
  }
}
    ${DashboardPartsFragmentDoc}`;

/**
 * __useDashboardQuery__
 *
 * To run a query within a React component, call `useDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDashboardQuery(baseOptions: Apollo.QueryHookOptions<DashboardQuery, DashboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DashboardQuery, DashboardQueryVariables>(DashboardDocument, options);
      }
export function useDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DashboardQuery, DashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DashboardQuery, DashboardQueryVariables>(DashboardDocument, options);
        }
export type DashboardQueryHookResult = ReturnType<typeof useDashboardQuery>;
export type DashboardLazyQueryHookResult = ReturnType<typeof useDashboardLazyQuery>;
export type DashboardQueryResult = Apollo.QueryResult<DashboardQuery, DashboardQueryVariables>;
export const DashboardsDocument = /*#__PURE__*/ gql`
    query dashboards {
  dashboards {
    ...DashboardParts
  }
}
    ${DashboardPartsFragmentDoc}`;

/**
 * __useDashboardsQuery__
 *
 * To run a query within a React component, call `useDashboardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDashboardsQuery(baseOptions?: Apollo.QueryHookOptions<DashboardsQuery, DashboardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DashboardsQuery, DashboardsQueryVariables>(DashboardsDocument, options);
      }
export function useDashboardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DashboardsQuery, DashboardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DashboardsQuery, DashboardsQueryVariables>(DashboardsDocument, options);
        }
export type DashboardsQueryHookResult = ReturnType<typeof useDashboardsQuery>;
export type DashboardsLazyQueryHookResult = ReturnType<typeof useDashboardsLazyQuery>;
export type DashboardsQueryResult = Apollo.QueryResult<DashboardsQuery, DashboardsQueryVariables>;
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
    