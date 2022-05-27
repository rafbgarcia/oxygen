import { map } from "lodash-es"

export const SelectField = ({
  name,
  label,
  collection,
  placeholder,
  defaultValue,
  type,
  register,
  ...props
}: Record<any, any>) => {
  return (
    <div {...props}>
      <label htmlFor={name} className="block font-medium">
        {label}
      </label>
      <select className="mt-1" {...register} defaultValue={defaultValue} name={name}>
        {map(collection, ({ value, label }) => (
          <option key={value} value={value}>
            {label || value}
          </option>
        ))}
      </select>
    </div>
  )
}
