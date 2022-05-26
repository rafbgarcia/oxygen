export const TextField = ({
  name,
  label,
  placeholder,
  defaultValue,
  type,
  autoFocus,
  register,
  ...props
}: Record<any, any>) => {
  type = type ?? 'text'

  return (
    <div {...props}>
      <label htmlFor={name} className="block font-medium ">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={name}
          name={name}
          type={type}
          autoFocus={autoFocus}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full border border-gray-300 rounded-md transition-all ease-in-out"
          placeholder={placeholder}
          defaultValue={defaultValue}
          {...register}
        />
      </div>
    </div>
  )
}
