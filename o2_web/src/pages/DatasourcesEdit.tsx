import { Button } from "playbook-ui"
import { useParams } from "react-router-dom"
import { Page } from "./Page"
import { Wait } from "../components/Wait"
import { useModal } from "../components/Modal"
import { useForm } from "react-hook-form"
import { TextField } from "../components/TextField"
import { useMutation, useQuery } from "@apollo/client"
import { PlayIcon } from "@heroicons/react/solid"
import { useDatasetQuery } from "../lib/codegenGraphql"

export const DatasourcesEdit = () => {
  const { id } = useParams()
  const { data, error } = useDatasetQuery({ variables: { id: id! } })
  const { showModal, Modal } = useModal()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  return (
    <>
      <Page.Header $flex>
        <Page.Title>{data?.dataset.name}</Page.Title>
        <Button icon="as" size="sm" onClick={showModal} variant="secondary">
          <PlayIcon className="w-4" />
          Build
        </Button>
      </Page.Header>
      <Page.Main>
        <div>
          {data?.dataset.tables?.map((table) => (
            <div key={table.id}>{table.name}</div>
          ))}
        </div>
      </Page.Main>
    </>
  )
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
