import { useForm } from "react-hook-form"
import { Button } from "../components/Button"
import { TextField } from "../components/TextField"
import { useLoadingMutation, useWaitingQuery } from "../lib/api"
import { Page } from "./Page"
import { useNavigate } from "react-router-dom"
import { SelectField } from "../components/SelectField"
import { map } from "lodash-es"

export const DashboardNew = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const { data, Waiting } = useWaitingQuery("getDatasets")
  const [createDashboard, saving] = useLoadingMutation("createDashboard")

  if (Waiting) return <Waiting />

  const datasetCollection = map(data.datasets, ({ id, name }) => ({ value: id, label: name }))
  const onSubmit = (data) => {
    createDashboard(data).then(() => navigate("/dashboards"))
  }

  return (
    <>
      <Page.Header>
        <Page.Title>New Dataset</Page.Title>
      </Page.Header>
      <Page.Main>
        <div className="container max-w-4xl m-auto p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              autoFocus
              label="Name"
              className="mb-5"
              register={register("name", { required: true })}
            />
            <SelectField
              collection={datasetCollection}
              allowBlank
              label="Dataset"
              register={register("datasetId", { required: true })}
              className="mb-5"
            />
            <Button loading={saving}>Save</Button>
          </form>
        </div>
      </Page.Main>
    </>
  )
}
