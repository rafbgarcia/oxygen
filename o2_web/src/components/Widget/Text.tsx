import { Title, Body } from "playbook-ui"

export const Text = ({ meta: props }) => {
  const { isTitle, text, ...rest } = props
  const Component = isTitle ? Title : Body
  return <Component {...rest}>{text}</Component>
}
