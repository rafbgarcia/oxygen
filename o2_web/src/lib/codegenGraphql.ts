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
  JSON: any;
};

export type ColumnInput = {
  foreignKeyId?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<DatasetTableColumnType>;
};

export type CreateWidgetMutationHandler = {
  __typename?: 'CreateWidgetMutationHandler';
  dashboard: Dashboard;
  widget: Widget;
};

export type Dashboard = {
  __typename?: 'Dashboard';
  created: Scalars['DateTime'];
  dataset: Dataset;
  id: Scalars['ID'];
  layout?: Maybe<Array<Maybe<DashboardLayout>>>;
  modified: Scalars['DateTime'];
  name: Scalars['String'];
  widgets: Array<Widget>;
};

export type DashboardLayout = {
  __typename?: 'DashboardLayout';
  h: Scalars['Int'];
  i: Scalars['ID'];
  w: Scalars['Int'];
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type Dataset = {
  __typename?: 'Dataset';
  buildDurationSeconds?: Maybe<Scalars['Int']>;
  created: Scalars['DateTime'];
  dashboards: Array<Dashboard>;
  id: Scalars['ID'];
  isBuilding?: Maybe<Scalars['Boolean']>;
  lastBuiltAt?: Maybe<Scalars['DateTime']>;
  modified: Scalars['DateTime'];
  name: Scalars['String'];
  relations: Array<DatasetRelation>;
  sizeMb?: Maybe<Scalars['Float']>;
  tables: Array<DatasetTable>;
};

export type DatasetRelation = {
  __typename?: 'DatasetRelation';
  dataset: Dataset;
  fullReference?: Maybe<Scalars['String']>;
  fullSource?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  referenceColumn: Scalars['String'];
  referenceTable: Scalars['String'];
  sourceColumn: Scalars['String'];
  sourceTable: Scalars['String'];
};

export type DatasetTable = {
  __typename?: 'DatasetTable';
  columns: Array<DatasetTableColumn>;
  dataset: Dataset;
  htmlPreview?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  query: Scalars['String'];
  title: Scalars['String'];
  totalRecords?: Maybe<Scalars['Int']>;
};

export type DatasetTableColumn = {
  __typename?: 'DatasetTableColumn';
  fullName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  table: DatasetTable;
  type: DatasetTableColumnType;
};

export enum DatasetTableColumnType {
  Datetime = 'DATETIME',
  Float = 'FLOAT',
  Integer = 'INTEGER',
  Text = 'TEXT'
}

export type Mutation = {
  __typename?: 'Mutation';
  buildDataset: Dataset;
  createDashboard: Dashboard;
  createDataset?: Maybe<Dataset>;
  createDatasetTable?: Maybe<Dataset>;
  createWidget?: Maybe<CreateWidgetMutationHandler>;
  deleteRelation?: Maybe<Scalars['Boolean']>;
  deleteWidget: Dashboard;
  updateColumn?: Maybe<DatasetTableColumn>;
  updateDashboardLayout: Dashboard;
  updateRelation?: Maybe<DatasetRelation>;
  updateWidgetBuildInfo?: Maybe<Widget>;
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


export type MutationCreateWidgetArgs = {
  buildInfo: Scalars['JSON'];
  dashboardId: Scalars['ID'];
  layout: WidgetLayoutInput;
  widgetType: WidgetType;
};


export type MutationDeleteRelationArgs = {
  relationId: Scalars['ID'];
};


export type MutationDeleteWidgetArgs = {
  widgetId: Scalars['ID'];
};


export type MutationUpdateColumnArgs = {
  data?: InputMaybe<ColumnInput>;
  id: Scalars['ID'];
};


export type MutationUpdateDashboardLayoutArgs = {
  dashboardId: Scalars['ID'];
  layout: Scalars['JSON'];
};


export type MutationUpdateRelationArgs = {
  currentRelationId?: InputMaybe<Scalars['ID']>;
  datasetId?: InputMaybe<Scalars['ID']>;
  fullReference?: InputMaybe<Scalars['String']>;
  fullSource?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateWidgetBuildInfoArgs = {
  buildInfo: Scalars['JSON'];
  widgetId: Scalars['ID'];
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
  buildInfo?: Maybe<Scalars['JSON']>;
  created: Scalars['DateTime'];
  dashboard: Dashboard;
  id: Scalars['ID'];
  modified: Scalars['DateTime'];
  renderData?: Maybe<Scalars['JSON']>;
  type: WidgetType;
};

export type WidgetLayoutInput = {
  h: Scalars['Int'];
  w: Scalars['Int'];
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export enum WidgetType {
  PivotTable = 'PIVOT_TABLE',
  Text = 'TEXT',
  VerticalBarChart = 'VERTICAL_BAR_CHART'
}

export type DashboardPartsFragment = { __typename?: 'Dashboard', id: string, name: string, created: any, modified: any, layout?: Array<{ __typename?: 'DashboardLayout', i: string, x: number, y: number, w: number, h: number } | null> | null };

export type DashboardLayoutPartsFragment = { __typename?: 'DashboardLayout', i: string, x: number, y: number, w: number, h: number };

export type DatasetPartsFragment = { __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null };

export type DatasetRelationPartsFragment = { __typename?: 'DatasetRelation', id: string, fullSource?: string | null, fullReference?: string | null };

export type DatasetTablePartsFragment = { __typename?: 'DatasetTable', id: string, name: string, title: string, query: string, totalRecords?: number | null, htmlPreview?: string | null, columns: Array<{ __typename?: 'DatasetTableColumn', id: string, name: string, fullName?: string | null, type: DatasetTableColumnType }> };

export type DatasetTableColumnPartsFragment = { __typename?: 'DatasetTableColumn', id: string, name: string, fullName?: string | null, type: DatasetTableColumnType };

export type WidgetPartsFragment = { __typename?: 'Widget', id: string, type: WidgetType, buildInfo?: any | null, renderData?: any | null };

export type BuildDatasetMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type BuildDatasetMutation = { __typename?: 'Mutation', dataset: { __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null } };

export type CreateDashboardMutationVariables = Exact<{
  name: Scalars['String'];
  datasetId: Scalars['ID'];
}>;


export type CreateDashboardMutation = { __typename?: 'Mutation', dashboard: { __typename?: 'Dashboard', id: string, name: string, created: any, modified: any, layout?: Array<{ __typename?: 'DashboardLayout', i: string, x: number, y: number, w: number, h: number } | null> | null } };

export type CreateDatasetMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateDatasetMutation = { __typename?: 'Mutation', dataset?: { __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null } | null };

export type CreateDatasetTableMutationVariables = Exact<{
  datasetId: Scalars['ID'];
  name: Scalars['String'];
  query: Scalars['String'];
}>;


export type CreateDatasetTableMutation = { __typename?: 'Mutation', dataset?: { __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, title: string, query: string, totalRecords?: number | null, htmlPreview?: string | null, columns: Array<{ __typename?: 'DatasetTableColumn', id: string, name: string, fullName?: string | null, type: DatasetTableColumnType }> }> } | null };

export type CreateWidgetMutationVariables = Exact<{
  widgetType: WidgetType;
  dashboardId: Scalars['ID'];
  layout: WidgetLayoutInput;
  buildInfo: Scalars['JSON'];
}>;


export type CreateWidgetMutation = { __typename?: 'Mutation', createWidget?: { __typename?: 'CreateWidgetMutationHandler', dashboard: { __typename?: 'Dashboard', id: string, name: string, created: any, modified: any, widgets: Array<{ __typename?: 'Widget', id: string, type: WidgetType, buildInfo?: any | null, renderData?: any | null }>, layout?: Array<{ __typename?: 'DashboardLayout', i: string, x: number, y: number, w: number, h: number } | null> | null }, widget: { __typename?: 'Widget', id: string, type: WidgetType, buildInfo?: any | null, renderData?: any | null } } | null };

export type DeleteRelationMutationVariables = Exact<{
  relationId: Scalars['ID'];
}>;


export type DeleteRelationMutation = { __typename?: 'Mutation', deleteRelation?: boolean | null };

export type DeleteWidgetMutationVariables = Exact<{
  widgetId: Scalars['ID'];
}>;


export type DeleteWidgetMutation = { __typename?: 'Mutation', dashboard: { __typename?: 'Dashboard', id: string, widgets: Array<{ __typename?: 'Widget', id: string, type: WidgetType, buildInfo?: any | null, renderData?: any | null }> } };

export type UpdateColumnMutationVariables = Exact<{
  id: Scalars['ID'];
  data: ColumnInput;
}>;


export type UpdateColumnMutation = { __typename?: 'Mutation', column?: { __typename?: 'DatasetTableColumn', id: string, name: string, fullName?: string | null, type: DatasetTableColumnType } | null };

export type UpdateDashboardLayoutMutationVariables = Exact<{
  dashboardId: Scalars['ID'];
  layout: Scalars['JSON'];
}>;


export type UpdateDashboardLayoutMutation = { __typename?: 'Mutation', dashboard: { __typename?: 'Dashboard', id: string, layout?: Array<{ __typename?: 'DashboardLayout', i: string, x: number, y: number, w: number, h: number } | null> | null } };

export type UpdateRelationMutationVariables = Exact<{
  datasetId?: InputMaybe<Scalars['ID']>;
  currentRelationId?: InputMaybe<Scalars['ID']>;
  fullSource?: InputMaybe<Scalars['String']>;
  fullReference?: InputMaybe<Scalars['String']>;
}>;


export type UpdateRelationMutation = { __typename?: 'Mutation', updateRelation?: { __typename?: 'DatasetRelation', id: string, fullSource?: string | null, fullReference?: string | null } | null };

export type UpdateWidgetBuildInfoMutationVariables = Exact<{
  widgetId: Scalars['ID'];
  buildInfo: Scalars['JSON'];
}>;


export type UpdateWidgetBuildInfoMutation = { __typename?: 'Mutation', widget?: { __typename?: 'Widget', id: string, buildInfo?: any | null, renderData?: any | null } | null };

export type DashboardQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DashboardQuery = { __typename?: 'Query', dashboard: { __typename?: 'Dashboard', id: string, name: string, created: any, modified: any, dataset: { __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, title: string, query: string, totalRecords?: number | null, htmlPreview?: string | null, columns: Array<{ __typename?: 'DatasetTableColumn', id: string, name: string, fullName?: string | null, type: DatasetTableColumnType }> }> }, widgets: Array<{ __typename?: 'Widget', id: string, type: WidgetType, buildInfo?: any | null, renderData?: any | null }>, layout?: Array<{ __typename?: 'DashboardLayout', i: string, x: number, y: number, w: number, h: number } | null> | null } };

export type DashboardsQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardsQuery = { __typename?: 'Query', dashboards: Array<{ __typename?: 'Dashboard', id: string, name: string, created: any, modified: any, layout?: Array<{ __typename?: 'DashboardLayout', i: string, x: number, y: number, w: number, h: number } | null> | null }> };

export type DatasetQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DatasetQuery = { __typename?: 'Query', dataset: { __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null, tables: Array<{ __typename?: 'DatasetTable', id: string, name: string, title: string, query: string, totalRecords?: number | null, htmlPreview?: string | null, columns: Array<{ __typename?: 'DatasetTableColumn', id: string, name: string, fullName?: string | null, type: DatasetTableColumnType }> }>, relations: Array<{ __typename?: 'DatasetRelation', id: string, fullSource?: string | null, fullReference?: string | null }> } };

export type DatasetsQueryVariables = Exact<{ [key: string]: never; }>;


export type DatasetsQuery = { __typename?: 'Query', datasets: Array<{ __typename?: 'Dataset', id: string, name: string, lastBuiltAt?: any | null }> };

export const DashboardLayoutPartsFragmentDoc = /*#__PURE__*/ gql`
    fragment DashboardLayoutParts on DashboardLayout {
  i
  x
  y
  w
  h
}
    `;
export const DashboardPartsFragmentDoc = /*#__PURE__*/ gql`
    fragment DashboardParts on Dashboard {
  id
  name
  created
  modified
  layout {
    ...DashboardLayoutParts
  }
}
    ${DashboardLayoutPartsFragmentDoc}`;
export const DatasetPartsFragmentDoc = /*#__PURE__*/ gql`
    fragment DatasetParts on Dataset {
  id
  name
  lastBuiltAt
}
    `;
export const DatasetRelationPartsFragmentDoc = /*#__PURE__*/ gql`
    fragment DatasetRelationParts on DatasetRelation {
  id
  fullSource
  fullReference
}
    `;
export const DatasetTableColumnPartsFragmentDoc = /*#__PURE__*/ gql`
    fragment DatasetTableColumnParts on DatasetTableColumn {
  id
  name
  fullName
  type
}
    `;
export const DatasetTablePartsFragmentDoc = /*#__PURE__*/ gql`
    fragment DatasetTableParts on DatasetTable {
  id
  name
  title
  query
  totalRecords
  htmlPreview
  columns {
    ...DatasetTableColumnParts
  }
}
    ${DatasetTableColumnPartsFragmentDoc}`;
export const WidgetPartsFragmentDoc = /*#__PURE__*/ gql`
    fragment WidgetParts on Widget {
  id
  type
  buildInfo
  renderData
}
    `;
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
    tables {
      ...DatasetTableParts
    }
  }
}
    ${DatasetPartsFragmentDoc}
${DatasetTablePartsFragmentDoc}`;
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
export const CreateWidgetDocument = /*#__PURE__*/ gql`
    mutation createWidget($widgetType: WidgetType!, $dashboardId: ID!, $layout: WidgetLayoutInput!, $buildInfo: JSON!) {
  createWidget(
    widgetType: $widgetType
    dashboardId: $dashboardId
    layout: $layout
    buildInfo: $buildInfo
  ) {
    dashboard {
      ...DashboardParts
      widgets {
        ...WidgetParts
      }
    }
    widget {
      ...WidgetParts
    }
  }
}
    ${DashboardPartsFragmentDoc}
${WidgetPartsFragmentDoc}`;
export type CreateWidgetMutationFn = Apollo.MutationFunction<CreateWidgetMutation, CreateWidgetMutationVariables>;

/**
 * __useCreateWidgetMutation__
 *
 * To run a mutation, you first call `useCreateWidgetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWidgetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWidgetMutation, { data, loading, error }] = useCreateWidgetMutation({
 *   variables: {
 *      widgetType: // value for 'widgetType'
 *      dashboardId: // value for 'dashboardId'
 *      layout: // value for 'layout'
 *      buildInfo: // value for 'buildInfo'
 *   },
 * });
 */
export function useCreateWidgetMutation(baseOptions?: Apollo.MutationHookOptions<CreateWidgetMutation, CreateWidgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWidgetMutation, CreateWidgetMutationVariables>(CreateWidgetDocument, options);
      }
export type CreateWidgetMutationHookResult = ReturnType<typeof useCreateWidgetMutation>;
export type CreateWidgetMutationResult = Apollo.MutationResult<CreateWidgetMutation>;
export type CreateWidgetMutationOptions = Apollo.BaseMutationOptions<CreateWidgetMutation, CreateWidgetMutationVariables>;
export const DeleteRelationDocument = /*#__PURE__*/ gql`
    mutation deleteRelation($relationId: ID!) {
  deleteRelation(relationId: $relationId)
}
    `;
export type DeleteRelationMutationFn = Apollo.MutationFunction<DeleteRelationMutation, DeleteRelationMutationVariables>;

/**
 * __useDeleteRelationMutation__
 *
 * To run a mutation, you first call `useDeleteRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRelationMutation, { data, loading, error }] = useDeleteRelationMutation({
 *   variables: {
 *      relationId: // value for 'relationId'
 *   },
 * });
 */
export function useDeleteRelationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRelationMutation, DeleteRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRelationMutation, DeleteRelationMutationVariables>(DeleteRelationDocument, options);
      }
export type DeleteRelationMutationHookResult = ReturnType<typeof useDeleteRelationMutation>;
export type DeleteRelationMutationResult = Apollo.MutationResult<DeleteRelationMutation>;
export type DeleteRelationMutationOptions = Apollo.BaseMutationOptions<DeleteRelationMutation, DeleteRelationMutationVariables>;
export const DeleteWidgetDocument = /*#__PURE__*/ gql`
    mutation deleteWidget($widgetId: ID!) {
  dashboard: deleteWidget(widgetId: $widgetId) {
    id
    widgets {
      ...WidgetParts
    }
  }
}
    ${WidgetPartsFragmentDoc}`;
export type DeleteWidgetMutationFn = Apollo.MutationFunction<DeleteWidgetMutation, DeleteWidgetMutationVariables>;

/**
 * __useDeleteWidgetMutation__
 *
 * To run a mutation, you first call `useDeleteWidgetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteWidgetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteWidgetMutation, { data, loading, error }] = useDeleteWidgetMutation({
 *   variables: {
 *      widgetId: // value for 'widgetId'
 *   },
 * });
 */
export function useDeleteWidgetMutation(baseOptions?: Apollo.MutationHookOptions<DeleteWidgetMutation, DeleteWidgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteWidgetMutation, DeleteWidgetMutationVariables>(DeleteWidgetDocument, options);
      }
export type DeleteWidgetMutationHookResult = ReturnType<typeof useDeleteWidgetMutation>;
export type DeleteWidgetMutationResult = Apollo.MutationResult<DeleteWidgetMutation>;
export type DeleteWidgetMutationOptions = Apollo.BaseMutationOptions<DeleteWidgetMutation, DeleteWidgetMutationVariables>;
export const UpdateColumnDocument = /*#__PURE__*/ gql`
    mutation updateColumn($id: ID!, $data: ColumnInput!) {
  column: updateColumn(id: $id, data: $data) {
    ...DatasetTableColumnParts
  }
}
    ${DatasetTableColumnPartsFragmentDoc}`;
export type UpdateColumnMutationFn = Apollo.MutationFunction<UpdateColumnMutation, UpdateColumnMutationVariables>;

/**
 * __useUpdateColumnMutation__
 *
 * To run a mutation, you first call `useUpdateColumnMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateColumnMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateColumnMutation, { data, loading, error }] = useUpdateColumnMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateColumnMutation(baseOptions?: Apollo.MutationHookOptions<UpdateColumnMutation, UpdateColumnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateColumnMutation, UpdateColumnMutationVariables>(UpdateColumnDocument, options);
      }
export type UpdateColumnMutationHookResult = ReturnType<typeof useUpdateColumnMutation>;
export type UpdateColumnMutationResult = Apollo.MutationResult<UpdateColumnMutation>;
export type UpdateColumnMutationOptions = Apollo.BaseMutationOptions<UpdateColumnMutation, UpdateColumnMutationVariables>;
export const UpdateDashboardLayoutDocument = /*#__PURE__*/ gql`
    mutation updateDashboardLayout($dashboardId: ID!, $layout: JSON!) {
  dashboard: updateDashboardLayout(dashboardId: $dashboardId, layout: $layout) {
    id
    layout {
      ...DashboardLayoutParts
    }
  }
}
    ${DashboardLayoutPartsFragmentDoc}`;
export type UpdateDashboardLayoutMutationFn = Apollo.MutationFunction<UpdateDashboardLayoutMutation, UpdateDashboardLayoutMutationVariables>;

/**
 * __useUpdateDashboardLayoutMutation__
 *
 * To run a mutation, you first call `useUpdateDashboardLayoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDashboardLayoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDashboardLayoutMutation, { data, loading, error }] = useUpdateDashboardLayoutMutation({
 *   variables: {
 *      dashboardId: // value for 'dashboardId'
 *      layout: // value for 'layout'
 *   },
 * });
 */
export function useUpdateDashboardLayoutMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDashboardLayoutMutation, UpdateDashboardLayoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDashboardLayoutMutation, UpdateDashboardLayoutMutationVariables>(UpdateDashboardLayoutDocument, options);
      }
export type UpdateDashboardLayoutMutationHookResult = ReturnType<typeof useUpdateDashboardLayoutMutation>;
export type UpdateDashboardLayoutMutationResult = Apollo.MutationResult<UpdateDashboardLayoutMutation>;
export type UpdateDashboardLayoutMutationOptions = Apollo.BaseMutationOptions<UpdateDashboardLayoutMutation, UpdateDashboardLayoutMutationVariables>;
export const UpdateRelationDocument = /*#__PURE__*/ gql`
    mutation updateRelation($datasetId: ID, $currentRelationId: ID, $fullSource: String, $fullReference: String) {
  updateRelation(
    datasetId: $datasetId
    currentRelationId: $currentRelationId
    fullSource: $fullSource
    fullReference: $fullReference
  ) {
    ...DatasetRelationParts
  }
}
    ${DatasetRelationPartsFragmentDoc}`;
export type UpdateRelationMutationFn = Apollo.MutationFunction<UpdateRelationMutation, UpdateRelationMutationVariables>;

/**
 * __useUpdateRelationMutation__
 *
 * To run a mutation, you first call `useUpdateRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRelationMutation, { data, loading, error }] = useUpdateRelationMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      currentRelationId: // value for 'currentRelationId'
 *      fullSource: // value for 'fullSource'
 *      fullReference: // value for 'fullReference'
 *   },
 * });
 */
export function useUpdateRelationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRelationMutation, UpdateRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRelationMutation, UpdateRelationMutationVariables>(UpdateRelationDocument, options);
      }
export type UpdateRelationMutationHookResult = ReturnType<typeof useUpdateRelationMutation>;
export type UpdateRelationMutationResult = Apollo.MutationResult<UpdateRelationMutation>;
export type UpdateRelationMutationOptions = Apollo.BaseMutationOptions<UpdateRelationMutation, UpdateRelationMutationVariables>;
export const UpdateWidgetBuildInfoDocument = /*#__PURE__*/ gql`
    mutation updateWidgetBuildInfo($widgetId: ID!, $buildInfo: JSON!) {
  widget: updateWidgetBuildInfo(widgetId: $widgetId, buildInfo: $buildInfo) {
    id
    buildInfo
    renderData
  }
}
    `;
export type UpdateWidgetBuildInfoMutationFn = Apollo.MutationFunction<UpdateWidgetBuildInfoMutation, UpdateWidgetBuildInfoMutationVariables>;

/**
 * __useUpdateWidgetBuildInfoMutation__
 *
 * To run a mutation, you first call `useUpdateWidgetBuildInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWidgetBuildInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWidgetBuildInfoMutation, { data, loading, error }] = useUpdateWidgetBuildInfoMutation({
 *   variables: {
 *      widgetId: // value for 'widgetId'
 *      buildInfo: // value for 'buildInfo'
 *   },
 * });
 */
export function useUpdateWidgetBuildInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWidgetBuildInfoMutation, UpdateWidgetBuildInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWidgetBuildInfoMutation, UpdateWidgetBuildInfoMutationVariables>(UpdateWidgetBuildInfoDocument, options);
      }
export type UpdateWidgetBuildInfoMutationHookResult = ReturnType<typeof useUpdateWidgetBuildInfoMutation>;
export type UpdateWidgetBuildInfoMutationResult = Apollo.MutationResult<UpdateWidgetBuildInfoMutation>;
export type UpdateWidgetBuildInfoMutationOptions = Apollo.BaseMutationOptions<UpdateWidgetBuildInfoMutation, UpdateWidgetBuildInfoMutationVariables>;
export const DashboardDocument = /*#__PURE__*/ gql`
    query dashboard($id: ID!) {
  dashboard(id: $id) {
    ...DashboardParts
    dataset {
      ...DatasetParts
      tables {
        ...DatasetTableParts
      }
    }
    widgets {
      ...WidgetParts
    }
  }
}
    ${DashboardPartsFragmentDoc}
${DatasetPartsFragmentDoc}
${DatasetTablePartsFragmentDoc}
${WidgetPartsFragmentDoc}`;

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
    tables {
      ...DatasetTableParts
    }
    relations {
      ...DatasetRelationParts
    }
  }
}
    ${DatasetPartsFragmentDoc}
${DatasetTablePartsFragmentDoc}
${DatasetRelationPartsFragmentDoc}`;

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
    