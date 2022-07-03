import { Button, Body } from "playbook-ui"
import { useNavigate, useParams } from "react-router-dom"
import { Modal } from "../../components/Modal"
import { useForm } from "react-hook-form"
import { TextField } from "../../components/TextField"
import { useCreateDatasetTableMutation } from "../../lib/codegenGraphql"
import { TextareaField } from "../../components/TextareaField"

export const DatasetTableNew = () => {
  const navigate = useNavigate()
  const { datasetId } = useParams()
  const { register, handleSubmit } = useForm()
  const [createDatasetTable, { loading: saving, error }] = useCreateDatasetTableMutation()

  const hideModal = (tableId?: string) => {
    if (typeof tableId === "string") {
      navigate(`/datasets/${datasetId}/tables/${tableId}`)
    } else {
      navigate(`/datasets/${datasetId}/edit`)
    }
  }

  const onSubmit = (data) => {
    createDatasetTable({ variables: { ...data, datasetId } }).then((res) => {
      const tables = res.data?.dataset?.tables
      if (!tables) return

      hideModal(tables[tables.length - 1].id)
    })
  }

  return (
    <Modal show onClose={hideModal} className="w-[900px]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Title>New Table</Modal.Title>
          <TextField label="Name" className="mb-5" register={register("name", { required: true })} />
          <TextareaField label="Query" className="mb-5" register={register("query", { required: true })} />
          {error && (
            <Body status="negative">
              <small>{error?.message}</small>
            </Body>
          )}
        </Modal.Body>
        <Modal.Actions>
          <Button className="ml-2" htmlType="submit" loading={saving}>
            Save
          </Button>
          <Button variant="secondary" className="ml-2" onClick={hideModal}>
            Cancel
          </Button>
        </Modal.Actions>
      </form>
    </Modal>
  )
}
