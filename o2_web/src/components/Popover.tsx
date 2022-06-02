import { Popover as HeadlessPopover } from "@headlessui/react"
import { classnames } from "../lib/classnames"

type PopoverProps = {
  Button: JSX.Element
  children: JSX.Element
  position?: "bottom-left" | "bottom-right"
}
export const Popover = ({ Button, children, position }: PopoverProps) => {
  position ||= "bottom-right"

  const positionClass = classnames({
    "left-0 top-full": position == "bottom-right",
    "right-0 top-full": position == "bottom-left",
  })
  const classes = classnames("w-fit absolute z-10 bg-white", positionClass)
  return (
    <HeadlessPopover className="relative">
      {({ open }) => (
        <>
          <HeadlessPopover.Button as="span">{Button}</HeadlessPopover.Button>

          <HeadlessPopover.Panel className={classes}>
            <div className="oveflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="relative grid bg-white overflow-auto whitespace-nowrap">{children}</div>
            </div>
          </HeadlessPopover.Panel>
        </>
      )}
    </HeadlessPopover>
  )
}
