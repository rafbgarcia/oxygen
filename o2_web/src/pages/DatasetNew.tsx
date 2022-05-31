import { useEffect, useState } from "react"
import { TrashIcon, PlusSmIcon } from "@heroicons/react/outline"
import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "../components/Button"
import { TextField } from "../components/TextField"
import { TextareaField } from "../components/TextareaField"
import { useMutation as useLoadingMutation } from "../lib/api"
import { Table } from "../components/Table"
import { Page } from "./Page"
import { map, isEmpty } from "lodash-es"
import { useNavigate } from "react-router-dom"
import { classnames } from "../lib/classnames"

type Preview = { fields: DatasetTable["fields"]; html: string }
type FormData = {
  tables: Array<DatasetTable>
  name: string
}

const newTableValues = {
  name: "Untitled",
}
const defaultValues = {
  tables: [newTableValues],
}

export const Dataset = () => {
  const navigate = useNavigate()
  const [getDatasetPreview, loadingPreview] = useLoadingMutation("previewDataset")
  const [createDataset, loadingSave] = useLoadingMutation("createDataset")
  const { register, control, watch, handleSubmit } = useForm<FormData>({ defaultValues })
  const { fields: tables, append, remove, update } = useFieldArray({ control, name: "tables" })
  const [activeTableId, setActiveTableId] = useState(tables[0]?.id)
  const handlePreview = (table, index) => {
    getDatasetPreview(table).then((preview) => {
      update(index, { ...preview, query: table.query, name: table.name })
    })
  }
  const handleSave = (data) => {
    createDataset({ ...data }).then(() => navigate("/datasets"))
  }

  const watchFieldArray = watch("tables")
  const controlledTables = tables.map((table, index) => ({
    ...table,
    ...watchFieldArray[index],
  }))

  const addTable = () => append(newTableValues, { focusIndex: 1 })
  useEffect(() => {
    setActiveTableId(tables[tables.length - 1]?.id)
  }, [tables])

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Page.Header $flex>
        <Page.Title>New Dataset</Page.Title>
        <Button $primary disabled={false} type="submit" loading={loadingSave}>
          Save
        </Button>
      </Page.Header>
      <Page.Main>
        <div className="p-4">
          <TextField
            label="Dataset Name"
            className="mb-5 w-[400px]"
            register={register("name", { required: true })}
          />
          <nav className="relative z-0 inline-flex rounded-md -space-x-px" aria-label="Pagination">
            {controlledTables.map((table, index) => (
              <a
                href="#"
                className={classnames(
                  "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium",
                  {
                    "z-10 bg-indigo-50 border-indigo-500 text-indigo-600 hover:bg-indigo-50":
                      activeTableId === table.id,
                  }
                )}
                key={table.id}
                onClick={() => setActiveTableId(table.id)}
              >
                {table.name} &nbsp;
                <span onClick={() => remove(index)}>
                  <TrashIcon className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-800" />
                </span>
              </a>
            ))}
            <div className="pl-2">
              <Button onClick={addTable}>Add Table</Button>
            </div>
          </nav>
          <div className="mt-5">
            {controlledTables.map((table, index) => (
              <div key={table.id} className={classnames({ hidden: table.id != activeTableId })}>
                <div className="w-[400px]">
                  <TextField
                    label="Table Name"
                    className="mb-5"
                    register={register(`tables.${index}.name`, { required: true })}
                  />
                  <TextareaField
                    label="Query"
                    className="mb-5"
                    register={register(`tables.${index}.query`, { required: true })}
                  />
                  <Button
                    className="flex items-center"
                    loading={loadingPreview}
                    type="button"
                    onClick={() => handlePreview(table, index)}
                  >
                    Preview
                  </Button>
                </div>
                {table.htmlPreview && <Preview table={table} />}
              </div>
            ))}
          </div>
        </div>
      </Page.Main>
    </form>
  )
}

const Fields = ({ fields }) => {
  const items = map(fields, ({ type, name }) => (
    <tr key={name}>
      <Table.th>{name}</Table.th>
      <Table.td>
        <select className="w-full">
          <option value="">{type}</option>
        </select>
      </Table.td>
    </tr>
  ))

  return (
    <>
      <Table>
        <tbody>{items}</tbody>
      </Table>
    </>
  )
}

const Preview = ({ table }) => {
  return (
    <div className="flex items-start justify-between gap-5 relative mt-5">
      <aside className="bg-white shadow-sm w-[400px]">
        <div className="p-4 overflow-auto">
          <Fields fields={table.fields} />
        </div>
      </aside>

      <div className="overflow-auto w-full">
        <Table className="bg-white">
          <Table.HTMLBody html={table.htmlPreview} />
        </Table>
      </div>
    </div>
  )
}
