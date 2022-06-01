import { Button } from "playbook-ui"
import { useParams } from "react-router-dom"
import { Modal } from "../components/Modal"
import { useForm } from "react-hook-form"
import { TextField } from "../components/TextField"
import { noop } from "lodash-es"
import { useCreateDatasetMutation } from "../lib/codegenGraphql"

export const DatasourcesEditTableNew = () => {
  const { datasetId } = useParams()
  const { register, handleSubmit } = useForm()
  const [createDataset, { loading }] = useCreateDatasetMutation()
  const onSubmit = (data) => {
    createDataset({ variables: { ...data, datasetId } })
  }

  return (
    <Modal show onClose={noop}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Title>New Table</Modal.Title>

          <TextField label="Name" className="mb-5" register={register("name", { required: true })} />
        </Modal.Body>
        <Modal.Actions>
          <Button size="sm" className="ml-2" htmlType="submit" loading={loading}>
            Save
          </Button>
          <Button size="sm" variant="secondary" className="ml-2">
            Cancel
          </Button>
        </Modal.Actions>
      </form>
    </Modal>
  )
}
