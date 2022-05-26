import { Button } from "../components/Button"
import { DatabaseIcon } from "@heroicons/react/outline"
import { Chip } from "../components/Chip"
import { Link } from "react-router-dom"
import { Page } from "./Page"
import { Avatar } from "../components/Avatar"

const dbs = ["TA - Follow Ups", "TA - Revenue Recruitment", "TA - Install Partner", "Sales", "BT Support Tickets"]

export const Datasets = () => {
  return (
    <>
      <Page.Header className="flex justify-between">
        <Page.Title>Datasets</Page.Title>
        <Link to="/datasets/new">
          <Button>New Dataset</Button>
        </Link>
      </Page.Header>
      <Page.Main>
        <dl className="space-y-10 grid grid-cols-4 gap-x-8 gap-y-10 p-4">
          {dbs.map((v) => (
            <div key={v} className="relative bg-white p-4 rounded-md shadow-sm">
              <dt>
                <div className="absolute flex items-center justify-center">
                  <DatabaseIcon className="w-8" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900 flex items-center">{v}</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                <p>Builds every 1 hour</p>
                <p>Last update 35 minutes ago</p>
                {v == "TA - Follow Ups" && (
                  <div>
                    Used by
                    <ul>
                      <li>
                        <Chip color="gray">TA - Follow Ups Dashboard</Chip>
                      </li>
                    </ul>
                  </div>
                )}
                <p>Size: 234MB</p>
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
