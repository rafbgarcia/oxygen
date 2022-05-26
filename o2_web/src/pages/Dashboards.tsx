import { Button } from "../components/Button"
import { DesktopComputerIcon } from "@heroicons/react/outline"
import { Chip } from "../components/Chip"
import { Link } from "react-router-dom"
import { Page } from "./Page"
import { api } from "../lib/api"

export const Dashboards = () => {
  const { data, error } = api.getDashboards()

  if (error) return <p>Error {JSON.stringify(error)}</p>
  if (!data) return <p>Loading...</p>

  return (
    <>
      <Page.Header $flex>
        <Page.Title>Dashboards</Page.Title>
        <Link to="/dashboards/new">
          <Button>New Dashboard</Button>
        </Link>
      </Page.Header>
      <Page.Main>
        <dl className="grid grid-cols-4 gap-x-14 gap-y-14 p-14">
          {data.dashboards.map((dashboard) => (
            <div key={dashboard.id} className="relative bg-white p-4 rounded-md shadow-sm">
              <dt>
                <div className="absolute flex items-center justify-center">
                  <DesktopComputerIcon className="w-8" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900 flex items-center">
                  {dashboard.name}
                </p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                <Button className="mt-4">Edit</Button>
              </dd>
            </div>
          ))}
        </dl>
      </Page.Main>
    </>
  )
}
