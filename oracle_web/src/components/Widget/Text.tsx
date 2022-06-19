import { Title, Body } from "playbook-ui"

export const Text = ({ widget }) => {
  const { isTitle, text, ...rest } = widget.buildInfo
  const Component = isTitle ? Title : Body

  return (
    <Component {...rest}>
      <span className="whitespace-pre-line">{text}</span>
    </Component>
  )
}
