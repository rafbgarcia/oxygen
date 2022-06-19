export const TextareaField = ({
  name,
  label,
  placeholder,
  defaultValue,
  rows,
  register,
  ...props
}: Record<any, any>) => {
  return (
    <div {...props}>
      <label htmlFor={name} className="block font-medium ">
        {label}
      </label>
      <div className="mt-1">
        <textarea
          id={name}
          name={name}
          rows={rows || 5}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full border border-gray-300 rounded-md transition-all ease-in-out"
          placeholder={placeholder}
          defaultValue={defaultValue}
          {...register}
        />
      </div>
    </div>
  )
}
