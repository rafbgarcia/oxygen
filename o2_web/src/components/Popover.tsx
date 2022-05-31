import { Fragment } from "react"
import { Popover as HeadlessPopover, Transition } from "@headlessui/react"

export const Popover = ({ Button, children }) => {
  return (
    <HeadlessPopover className="relative">
      {({ open }) => (
        <>
          <HeadlessPopover.Button>{Button}</HeadlessPopover.Button>
          <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <HeadlessPopover.Panel className="w-fit absolute left-full z-10 top-0 bg-white">
              <div className="oveflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid bg-white p-7 overflow-auto ">{children}</div>
              </div>
            </HeadlessPopover.Panel>
          </Transition>
        </>
      )}
    </HeadlessPopover>
  )
}
