import { tw } from "../lib/tw"

type HeaderProps = {
  $flex: boolean
}
export const Page = {
  Header: tw.header<HeaderProps>`
    bg-white border-b py-2 px-6
    ${(p) => p.$flex && "flex items-center justify-between"}
  `,

  Title: tw.h1`
    text-1xl font-bold text-gray-900
  `,

  Main: tw.main``,
}
