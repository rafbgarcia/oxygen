import { Spinner } from "./Spinner"

export const Wait = (data, error): false | (() => JSX.Element) => {
  if (error) return () => <p>Error {JSON.stringify(error)}</p>
  if (!data)
    return () => (
      <div className="flex justify-center mt-10">
        <Spinner label="Loading" $size="lg" />
      </div>
    )

  return false
}
