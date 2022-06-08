import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { tw } from "../lib/tw"
import { classnames } from "../lib/classnames"
import { every } from "lodash-es"

export const useModal = () => {
  const [show, setShow] = useState(false)
  const showModal = () => setShow(true)
  const hideModal = () => setShow(false)
  const Component = ({ children, ...props }) => (
    <Modal show={show} onClose={setShow} $sm {...props}>
      {typeof children == "function" ? children({ showModal, hideModal, Modal: Modal }) : children}
    </Modal>
  )
  return { showModal, hideModal, Modal: Component }
}

type ModalProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  children?: any
  show?: any
  onClose?: any
  initialFocus?: any
  $xs?: any
  $sm?: any
  $md?: any
  $lg?: any
}
export const Modal = ({
  children,
  show,
  onClose,
  initialFocus,
  $xs,
  $sm,
  $md,
  $lg,
  ...props
}: ModalProps) => {
  const size = classnames({
    "w-[200px]": $xs,
    "w-[400px]": $sm || every([$xs, $md, $lg], (v) => !v),
    "w-[600px]": $md,
    "w-[800px]": $lg,
  })
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog unmount as="div" className="relative z-10" onClose={onClose} initialFocus={initialFocus}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`${size} relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8`}
                {...props}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

Modal.Title = tw(Dialog.Title)`text-lg leading-6 font-medium text-gray-900 mb-5`
Modal.Body = tw.div`bg-white px-4 pt-5 pb-4`
Modal.Actions = tw.div`bg-gray-50 py-3 px-4 flex flex-row-reverse`
