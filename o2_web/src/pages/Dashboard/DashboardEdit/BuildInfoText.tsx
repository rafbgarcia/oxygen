import produce from "immer"
import { TextareaField } from "../../../components/TextareaField"
import { SelectField } from "../../../components/SelectField"
import { debounce } from "lodash-es"

export const BuildInfoText = ({ buildInfo, onChange }) => {
  const didUpdate = (field) => (event) => {
    const updatedBuildInfo = produce(buildInfo, (draft) => {
      draft[field] = event.target.value
    })
    onChange(updatedBuildInfo)
  }
  const didUpdateIsTitle = (event) => {
    didUpdate("isTitle")({ target: { value: event.target.value === "true" } })
  }

  return (
    <>
      <SelectField
        collection={[
          { value: true, label: "Title" },
          { value: false, label: "Body" },
        ]}
        label="Type"
        className="mb-5"
        defaultValue={buildInfo.isTitle}
        onChange={didUpdateIsTitle}
      />
      <TextareaField
        label="Text"
        defaultValue={buildInfo.text}
        className="mb-5"
        onChange={debounce(didUpdate("text"), 1000)}
      />
    </>
  )
}
