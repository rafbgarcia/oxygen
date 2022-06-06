import React from "react"
import { Button } from "playbook-ui"
import { Link, Outlet, useParams } from "react-router-dom"
import { Page } from "../Page"
import { Wait } from "../../components/Wait"
import { CheckIcon, LinkIcon, PlayIcon } from "@heroicons/react/solid"
import {
  TableIcon,
  PlusSmIcon,
  MenuIcon,
  HashtagIcon,
  CalendarIcon,
  DotsVerticalIcon,
} from "@heroicons/react/outline"
import {
  DatasetQuery,
  useBuildDatasetMutation,
  useDatasetQuery,
  DatasetTableColumnType,
  useUpdateColumnMutation,
  DatasetDocument,
} from "../../lib/codegenGraphql"
import { classnames } from "../../lib/classnames"
import { toast } from "react-toastify"
import { Popover } from "../../components/Popover"
import { tw } from "../../lib/tw"
import { Chip } from "../../components/Chip"

const FIELD_TYPE_ICON: Record<DatasetTableColumnType, any> = {
  [DatasetTableColumnType.Text]: () => (
    <div className="border border-gray-500 rounded-sm p-0.5">
      <MenuIcon className="w-3" />
    </div>
  ),
  [DatasetTableColumnType.Integer]: () => (
    <div className="border border-gray-500 rounded-sm p-0.5">
      <HashtagIcon className="w-3" />
    </div>
  ),
  [DatasetTableColumnType.Float]: () => FIELD_TYPE_ICON[DatasetTableColumnType.Integer](),
  [DatasetTableColumnType.Datetime]: () => (
    <div className="p-0.5">
      <CalendarIcon className="w-4" />
    </div>
  ),
}

export const DatasetEdit = () => {
  const { datasetId, tableId } = useParams()
  const { data, error } = useDatasetQuery({ variables: { id: datasetId! } })
  const [buildDataset, { loading: building }] = useBuildDatasetMutation()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  const handleBuild = () => {
    buildDataset({ variables: { id: datasetId! } }).then(() => {
      toast.info("Build complete!")
    })
  }

  return (
    <>
      <Page.Header $flex>
        <Page.Title>
          Datasets {">"} {data?.dataset.name}
        </Page.Title>

        <div className="ml-auto flex items-center gap-x-2">
          <Link to={`/datasets/${datasetId}/tables/new`}>
            <Button size="md" variant="secondary">
              <span className="flex items-center gap-x-1">
                <PlusSmIcon className="w-4" /> Table
              </span>
            </Button>
          </Link>
          <Button size="md" variant="secondary" onClick={handleBuild} loading={building}>
            <span className="flex items-center gap-x-1">
              <PlayIcon className="w-4" />
              Build
            </span>
          </Button>
        </div>
      </Page.Header>
      <Page.Main>
        <div className="flex items-start">
          <div className={`bg-white w-[305px] min-h-[calc(100vh-98px)] h-full  shadow-md`}>
            <Tables dataset={data!.dataset} tableId={tableId} />
          </div>
          <div className="p-4 overflow-auto max-w-[calc(100vw-340px)]">
            <Outlet context={{ dataset: data?.dataset }} />
          </div>
        </div>
      </Page.Main>
    </>
  )
}

const Tables = ({ dataset, tableId }: { dataset: DatasetQuery["dataset"]; tableId?: string }) => {
  if (dataset.tables.length == 0) {
    return <p className="p-4">No tables</p>
  }

  return (
    <>
      {dataset.tables.map((table) => (
        <div key={table.id}>
          <ul>
            <li>
              <Link
                to={`/datasets/${dataset.id}/tables/${table.id}`}
                className={classnames(
                  "group flex items-center gap-x-2 p-3 cursor-pointer hover:bg-gray-100",
                  { "bg-gray-100": tableId == table.id }
                )}
              >
                <TableIcon className="w-5 text-gray-400 group-hover:text-gray-500" />
                {table.name}
              </Link>
            </li>
          </ul>
          <ul className={classnames({ hidden: tableId != table.id })}>
            {table.columns.map((column) => (
              <TableColumn key={column.id} column={column} dataset={dataset} currentTable={table} />
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

const PopoverItem = tw.div`p-3 bg-white hover:bg-gray-100 cursor-pointer min-w-[200px]`

type TableColumnProps = {
  dataset: DatasetQuery["dataset"]
  column: DatasetQuery["dataset"]["tables"][0]["columns"][0]
  currentTable: DatasetQuery["dataset"]["tables"][0]
}
const TableColumn = ({ column, dataset, currentTable }: TableColumnProps) => {
  const [updateColumn] = useUpdateColumnMutation({ refetchQueries: [DatasetDocument] })
  const didChangeType = (type) => () => {
    updateColumn({ variables: { id: column.id, data: { type } } })
  }
  const didChangeForeignKey = (column, fk) => () => {
    updateColumn({ variables: { id: column.id, data: { foreignKeyId: fk.id } } })
  }
  const didClearForeignKey = (column) => () => {
    updateColumn({ variables: { id: column.id, data: { foreignKeyId: null } } })
  }

  return (
    <Popover
      position="right"
      Button={
        <li className="flex items-center justify-between py-3 pl-10 pr-3 hover:bg-gray-100 cursor-pointer">
          <span className="flex items-center gap-x-2">
            {React.createElement(FIELD_TYPE_ICON[column.type])}
            {column.name}
          </span>
          <span>{column.foreignKey && <LinkIcon className="w-4" />}</span>
        </li>
      }
    >
      <Popover position="right" Button={<PopoverItem>Type</PopoverItem>}>
        {Object.keys(DatasetTableColumnType).map((type) => (
          <PopoverItem
            className="flex items-center justify-between"
            key={type}
            onClick={didChangeType(DatasetTableColumnType[type])}
          >
            {type}
            {DatasetTableColumnType[type] === column.type && <CheckIcon className="w-4" />}
          </PopoverItem>
        ))}
      </Popover>

      <Popover position="right" Button={<PopoverItem>Foreign Key</PopoverItem>}>
        <div className="max-h-96 overflow-y-auto min-w-fit">
          <PopoverItem className="flex items-center justify-between" onClick={didClearForeignKey(column)}>
            <span>None</span>
            {!column.foreignKey && <CheckIcon className="w-4" />}
          </PopoverItem>

          {dataset.tables
            .filter((table) => currentTable !== table)
            .map((table) => (
              <ul key={table.id} className="border-b">
                {table.columns.map((tableColumn) => (
                  <PopoverItem
                    className="flex items-center justify-between"
                    key={tableColumn.id}
                    onClick={didChangeForeignKey(column, tableColumn)}
                  >
                    <span>
                      <Chip color="gray">{table.name}</Chip>.{tableColumn.name}
                    </span>
                    {column.foreignKey?.id == tableColumn.id && <CheckIcon className="w-4" />}
                  </PopoverItem>
                ))}
              </ul>
            ))}
        </div>
      </Popover>
    </Popover>
  )
}
