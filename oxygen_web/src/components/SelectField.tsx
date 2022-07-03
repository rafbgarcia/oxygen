import map from "lodash/map"

export const SelectField = ({
  name,
  label,
  collection,
  placeholder,
  defaultValue,
  type,
  register,
  allowBlank,
  onChange,
  ...props
}: Record<any, any>) => {
  register ||= {}

  return (
    <div {...props}>
      <label htmlFor={name} className="block font-medium">
        {label}
      </label>
      <select
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full border border-gray-300 rounded-md transition-all ease-in-out"
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        {...register}
      >
        {allowBlank && <option value="">{allowBlank === true ? "" : allowBlank}</option>}
        {map(collection, ({ value, label }) => (
          <option key={value} value={value}>
            {label || value}
          </option>
        ))}
      </select>
    </div>
  )
}
