import { Button } from "../components/Button"
import { DatabaseIcon } from "@heroicons/react/outline"
import { Chip } from "../components/Chip"
import { Link } from "react-router-dom"
import { Page } from "./Page"
import { api } from "../lib/api"
import { formatDistanceToNowStrict, parseISO, formatRelative } from "date-fns"

export const Datasets = () => {
  const { data, error } = api.getDatasets()

  if (error) return <p>Error {JSON.stringify(error)}</p>
  if (!data) return <p>Loading...</p>

  return (
    <>
      <Page.Header className="flex justify-between">
        <Page.Title>Datasets</Page.Title>
        <Link to="/datasets/new">
          <Button>New Dataset</Button>
        </Link>
      </Page.Header>
      <Page.Main>
        <dl className="grid grid-cols-4 gap-x-14 gap-y-14 p-14">
          {data.datasets.map((dataset) => (
            <div key={dataset.id} className="relative bg-white p-4 rounded-md shadow-sm">
              <dt>
                <div className="absolute flex items-center justify-center">
                  <DatabaseIcon className="w-8" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900 flex items-center">
                  {dataset.name}
                  <Chip className="ml-2" color="gray">
                    {dataset.sizeMb}MB
                  </Chip>
                </p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                <p>
                  Updated {formatDistanceToNowStrict(parseISO(dataset.lastBuiltAt))} ago
                  <span className="ml-1">(took {dataset.buildDurationSeconds}s)</span>
                </p>
                <p>{dataset.count} records</p>
                <p>Builds every 1 hour</p>
                <p className="flex items-center">Created by Rafael Garcia</p>
                <Button className="mt-4">Edit</Button>
              </dd>
            </div>
          ))}
        </dl>
      </Page.Main>
    </>
  )
}
