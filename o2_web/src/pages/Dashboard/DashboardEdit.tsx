import { Button, Body, Title, Avatar } from "playbook-ui"
import { DatabaseIcon } from "@heroicons/react/outline"
import { Link } from "react-router-dom"
import { Page } from "../Page"
import { Wait } from "../../components/Wait"
import { useModal } from "../../components/Modal"
import { useForm } from "react-hook-form"
import { TextField } from "../../components/TextField"
import { DatasetsDocument, useCreateDatasetMutation, useDashboardsQuery } from "../../lib/codegenGraphql"

export const DashboardIndex = () => {
  const { error, data } = useDashboardsQuery()
  const { showModal, Modal } = useModal()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  return (
    <>
      <Modal children={NewDatasourceForm} />
      <Page.Header $flex>
        <Page.Title>Dashboards</Page.Title>
        <Button size="sm" onClick={showModal} variant="secondary">
          + Dashboard
        </Button>
      </Page.Header>
      <Page.Main className="container m-auto max-w-screen-lg">
        <div className="grid grid-cols-3 gap-x-6 gap-y-6 p-4">
          {data?.dashboards.map((dataset) => (
            <Link
              to={`/dashboards/${dataset.id}/edit`}
              key={dataset.id}
              className="relative bg-white transition rounded-md cursor-pointer shadow-sm shadow-gray-300 hover:shadow-gray-400"
            >
              <div className="p-4 border-b">
                <Title size={5} className="text-lg font-medium text-gray-900 flex items-center">
                  {dataset.name}
                </Title>
              </div>
              <div className="flex items-center p-4">
                <Avatar size="xs" className="mr-2" name="Rafael Garcia" /> Rafael Garcia
              </div>
            </Link>
          ))}
        </div>
      </Page.Main>
    </>
  )
}
