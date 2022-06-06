import { Button, Body, Title, Avatar } from "playbook-ui"
import { DatabaseIcon } from "@heroicons/react/outline"
import { Link, useNavigate } from "react-router-dom"
import { Page } from "../Page"
import { Wait } from "../../components/Wait"
import { useModal } from "../../components/Modal"
import { useForm } from "react-hook-form"
import { TextField } from "../../components/TextField"
import {
  DashboardsDocument,
  DatasetsDocument,
  useCreateDashboardMutation,
  useCreateDatasetMutation,
  useDashboardsQuery,
  useDatasetsQuery,
} from "../../lib/codegenGraphql"
import { SelectField } from "../../components/SelectField"
import { map } from "lodash-es"

export const DashboardIndex = () => {
  const { error, data } = useDashboardsQuery()
  const { showModal, Modal } = useModal()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  return (
    <>
      <Modal children={NewDashboardForm} />
      <Page.Header $flex>
        <Page.Title>Dashboards</Page.Title>
        <Button onClick={showModal} variant="secondary">
          + Dashboard
        </Button>
      </Page.Header>
      <Page.Main className="container m-auto max-w-screen-lg">
        <div className="grid grid-cols-3 gap-x-6 gap-y-6 p-4">
          {data?.dashboards.map((dataset) => (
            <Link
              to={`/dashboards/${dataset.id}/edit`}
              key={dataset.id}
              className="relative bg-white transition rounded-md cursor-pointer shadow-sm shadow-gray-300 hover:shadow-gray-400"
            >
              <div className="p-4 border-b">
                <Title size={5} className="text-lg font-medium text-gray-900 flex items-center">
                  {dataset.name}
                </Title>
              </div>
              <div className="flex items-center p-4">
                <Avatar size="xs" className="mr-2" name="Rafael Garcia" /> Rafael Garcia
              </div>
            </Link>
          ))}
        </div>
      </Page.Main>
    </>
  )
}

const NewDashboardForm = ({ hideModal, Modal }) => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const { data } = useDatasetsQuery()
  const [createDashboard, { loading: creating }] = useCreateDashboardMutation({
    refetchQueries: [DashboardsDocument],
  })
  const onSubmit = (data) => {
    createDashboard({ variables: data }).then(({ data }) =>
      navigate(`/dashboards/${data?.dashboard.id}/edit`)
    )
    hideModal()
  }
  const datasetCollection = map(data?.datasets, ({ id, name }) => ({ value: id, label: name }))

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal.Body>
        <TextField autoFocus label="Name" className="mb-5" register={register("name", { required: true })} />
        <SelectField
          collection={datasetCollection}
          allowBlank
          label="Dataset"
          register={register("datasetId", { required: true })}
          className="mb-5"
        />
      </Modal.Body>
      <Modal.Actions>
        <Button size="sm" className="ml-2" htmlType="submit" loading={creating}>
          Save
        </Button>
        <Button size="sm" variant="secondary" className="ml-2" onClick={hideModal}>
          Cancel
        </Button>
      </Modal.Actions>
    </form>
  )
}
