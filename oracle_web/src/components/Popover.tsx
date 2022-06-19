import { Popover as HeadlessPopover } from "@headlessui/react"
import { classnames } from "../lib/classnames"

type PopoverProps = {
  Button: React.ReactNode
  position?: "bottom-left" | "bottom-right" | "right"
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const Popover = ({ Button, children, position, ...props }: PopoverProps) => {
  position ||= "bottom-right"

  const positionClass = classnames({
    "left-0 top-full": position == "bottom-right",
    "right-0 top-full": position == "bottom-left",
    "left-full top-0": position == "right",
  })
  const classes = classnames("min-w-fit absolute z-10 bg-white", positionClass)

  return (
    <HeadlessPopover {...props} className={classnames("relative", props.className)}>
      {({ open }) => (
        <>
          <HeadlessPopover.Button as="span">{Button}</HeadlessPopover.Button>

          <HeadlessPopover.Panel className={classes}>
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="relative grid bg-white whitespace-nowrap">{children}</div>
            </div>
          </HeadlessPopover.Panel>
        </>
      )}
    </HeadlessPopover>
  )
}

Popover.Button = HeadlessPopover.Button
