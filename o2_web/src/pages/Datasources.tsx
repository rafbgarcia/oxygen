import { Button, Body, Title, Avatar } from "playbook-ui"
import { DatabaseIcon } from "@heroicons/react/outline"
import { Link } from "react-router-dom"
import { Page } from "./Page"
import { parseISO, formatDistanceToNowStrict } from "date-fns"
import { Wait } from "../components/Wait"
import { useModal } from "../components/Modal"
import { useForm } from "react-hook-form"
import { TextField } from "../components/TextField"
import { useMutation, useQuery } from "@apollo/client"
import { queries } from "../lib/queries"
import { mutations } from "../lib/mutations"

export const Datasources = () => {
  const { error, data } = useQuery(queries.datasets)
  const { showModal, Modal } = useModal()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  return (
    <>
      <Modal children={NewDatasourceForm} />
      <Page.Header $flex>
        <Page.Title>Data Sources</Page.Title>
        <Button size="sm" onClick={showModal} variant="secondary">
          + Data Source
        </Button>
      </Page.Header>
      <Page.Main className="container m-auto max-w-screen-lg">
        <div className="grid grid-cols-3 gap-x-6 gap-y-6 p-4">
          {data.datasets.map((dataset) => (
            <Link
              to={`/datasets/${dataset.id}/edit`}
              key={dataset.id}
              className="relative bg-white transition rounded-md cursor-pointer shadow-sm shadow-gray-300 hover:shadow-gray-400"
            >
              <div className="p-4 border-b">
                <Title size={5} className="text-lg font-medium text-gray-900 flex items-center">
                  <DatabaseIcon className="w-4 mr-1" />
                  {dataset.name}
                </Title>

                <LastBuiltAt dateTimestring={dataset.lastBuiltAt} />
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

const LastBuiltAt = ({ dateTimestring }) => {
  const text = dateTimestring
    ? `Last built ${formatDistanceToNowStrict(parseISO(dateTimestring))} ago`
    : "Never built"
  return <Body color="light">{text}</Body>
}

const NewDatasourceForm = ({ hideModal, Modal }) => {
  const { register, handleSubmit } = useForm()
  const [createDataset, { loading }] = useMutation(mutations.createDataset, {
    refetchQueries: [queries.datasets],
  })
  const onSubmit = (data) => {
    createDataset({ variables: data })
    hideModal()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal.Body>
        <Modal.Title>Add Dimension</Modal.Title>

        <TextField label="Name" className="mb-5" register={register("name", { required: true })} />
      </Modal.Body>
      <Modal.Actions>
        <Button size="sm" className="ml-2" htmlType="submit" loading={loading}>
          Save
        </Button>
        <Button size="sm" variant="secondary" className="ml-2" onClick={hideModal}>
          Cancel
        </Button>
      </Modal.Actions>
    </form>
  )
}
