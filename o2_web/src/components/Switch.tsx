import { Switch as HeadlessSwitch } from "@headlessui/react"
import { useState } from "react"
import { classnames } from "../lib/classnames"

export const Switch = ({ label, initialValue, didChange, ...props }) => {
  const [enabled, setEnabled] = useState(initialValue)
  const enabledDidChange = (value) => {
    setEnabled(value)
    didChange(value)
  }
  const { className } = props

  return (
    <HeadlessSwitch.Group>
      <div className={classnames("flex items-center", className)} {...props}>
        <HeadlessSwitch.Label className="mr-4">{label}</HeadlessSwitch.Label>
        <HeadlessSwitch
          checked={enabled}
          onChange={enabledDidChange}
          className={`${
            enabled ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              enabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </HeadlessSwitch>
      </div>
    </HeadlessSwitch.Group>
  )
}
