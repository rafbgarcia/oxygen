import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "../components/Button"
import { TextField } from "../components/TextField"
import { TextareaField } from "../components/TextareaField"
import { api } from "../lib/api"
import { Table } from "../components/Table"
import { Page } from "./Page"
import { map } from "lodash-es"
import { useNavigate } from "react-router-dom"

const Form = ({ onSubmit, register, handleSubmit, waitingResponse }) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        autoFocus
        label="Dataset Name"
        className="mb-5"
        placeholder="ex: TA - Interviews"
        register={register("name", { required: true })}
      />
      <TextareaField
        label="Query"
        rows={3}
        className="mb-5"
        placeholder="ex: SELECT * FROM table LIMIT 10"
        register={register("query", { required: true })}
      />
      <Button className="flex items-center" loading={waitingResponse}>
        Preview
      </Button>
    </form>
  )
}

const Fields = ({ fields }) => {
  const items = map(fields, (type, name) => (
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

const Preview = ({ preview }) => {
  return (
    <div className="flex items-start justify-between gap-5 relative mt-5">
      <aside className="bg-white shadow-sm w-[400px]">
        <div className="p-4 overflow-auto">
          <Fields fields={preview.fields} />
        </div>
      </aside>

      <Table className="bg-white">
        <Table.HTMLBody html={preview.html} />
      </Table>
    </div>
  )
}

export const Dataset = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, getValues } = useForm()
  const [waiting, setWaiting] = useState({ preview: false, save: false })
  const [preview, setDataset] = useState<Record<any, any>>()
  const [error, setError] = useState()
  const onSubmit = (data) => {
    setWaiting({ preview: true, save: false })
    api
      .previewDataset(data)
      .then((preview) => {
        setWaiting({ preview: false, save: false })
        setDataset(preview)
      })
      .catch((err) => {
        setWaiting({ preview: false, save: false })
        setError(err)
      })
  }
  const save = () => {
    setWaiting({ preview: false, save: true })
    api
      .createDataset({ ...getValues(), dtypes: preview?.fields })
      .then(() => {
        setWaiting({ preview: false, save: false })
        navigate("/datasets")
      })
      .catch((err) => {
        setWaiting({ preview: false, save: false })
        setError(err)
      })
  }

  return (
    <>
      <Page.Header $flex>
        <Page.Title>New Dataset</Page.Title>
        <Button $primary onClick={save} disabled={!preview} loading={waiting.save}>
          Save
        </Button>
      </Page.Header>
      <Page.Main>
        <div className="container max-w-4xl m-auto p-4">
          <Form
            onSubmit={onSubmit}
            register={register}
            handleSubmit={handleSubmit}
            waitingResponse={waiting.preview}
          />
          {error && <span className="text-sm text-gray-500">{JSON.stringify(error)}</span>}
        </div>

        {preview && <Preview preview={preview} />}
      </Page.Main>
    </>
  )
}
