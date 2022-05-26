import { tw } from "../lib/tw"
import { classnames } from "../lib/classnames"
import { Spinner } from "./Spinner"

type TWButtonProps = {
  $primary?: boolean
}

const variants = {
  default: "bg-white border-gray-300 text-gray-800 hover:bg-gray-200 hover:border-gray-200",
  primary: "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-800",
}

const TWButton = tw.button<TWButtonProps>`
  rounded-md border px-6 py-2 flex items-center
  transition duration-150 ease-in-out
  disabled:opacity-50 disabled:pointer-events-none disabled:select-none
  ${(p) =>
    classnames({
      [variants.default]: !p.$primary,
      [variants.primary]: p.$primary,
    })}
`

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
  TWButtonProps & {
    loading?: boolean
  }
export const Button = ({ loading, children, disabled, ...props }: ButtonProps) => (
  <TWButton {...props} disabled={disabled || loading}>
    {loading && <Spinner className="mr-2" $size="sm" />}
    {children}
  </TWButton>
)
