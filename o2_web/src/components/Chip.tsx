import { classnames } from '../lib/classnames'

type ChipProps = Record<string, any> & {
  color?: 'green' | 'gray' | 'red'
}
export const Chip = ({ children, className, color, ...props }: ChipProps) => {
  const defaultClasses = 'rounded-3xl text-sm text-white inline-block min-w-min px-2 pb-0.5'
  const classes = classnames(defaultClasses, className, {
    'bg-green-600': !color || color == 'green',
    'bg-gray-600': color == 'gray',
    'bg-red-600': color == 'red',
  })

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}
