import { tw } from "../lib/tw"
import { classnames } from "../lib/classnames"
import { Spinner } from "./Spinner"
import { every } from "lodash-es"

type Variants = { [key in keyof typeof variants]?: boolean }
type Sizes = { [key in keyof typeof sizes]?: boolean }
type TWButtonProps = Variants & Sizes
type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
  TWButtonProps & {
    loading?: boolean
  }

const defaultVariant = "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500"
const variants = {
  $primary: "border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  $danger: "border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
}
const sizes = {
  $iconXs: "p-1",
  $iconSm: "p-2",
}
const TWButton = tw.button<TWButtonProps>`
  inline-block justify-center rounded-md border shadow-sm px-4 py-2 text-sm font-medium
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:opacity-50 disabled:pointer-events-none disabled:select-none
  ${(p) =>
    classnames(
      {
        [defaultVariant]: every(variants, (_, variant) => !p[variant]),
        [variants.$primary]: p.$primary,
        [variants.$danger]: p.$danger,
      },
      {
        [sizes.$iconXs]: p.$iconXs,
        [sizes.$iconSm]: p.$iconSm,
      }
    )}
`

export const Button = ({ loading, children, disabled, ...props }: ButtonProps) => (
  <TWButton {...props} disabled={disabled || loading}>
    {loading && <Spinner className="mr-2" $size="sm" />}
    {children}
  </TWButton>
)
