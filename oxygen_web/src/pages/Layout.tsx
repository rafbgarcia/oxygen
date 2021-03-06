import { Fragment } from "react"
import { Link, LinkProps } from "react-router-dom"
import { Outlet, useMatch, useResolvedPath } from "react-router-dom"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { BellIcon } from "@heroicons/react/outline"
import { classnames } from "../lib/classnames"
import logo from "../assets/logo.png"
import { Avatar } from "../components/Avatar"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const ActiveLink = ({ children, to, end, ...props }: LinkProps & { end?: boolean }) => {
  let resolved = useResolvedPath(to)
  let match = useMatch({ path: resolved.pathname, end: end || false })

  const classes = classnames("text-white px-3 py-2 rounded-md text-sm font-medium", {
    "bg-gray-900": match,
    "text-gray-300 hover:bg-gray-700 hover:text-white": !match,
  })
  return (
    <Link className={classes} to={to} {...props}>
      {children}
    </Link>
  )
}

const Nav = () => {
  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="px-4">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-medium text-2xl text-white ml-3">Oxygen</span>
            </Link>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <ActiveLink to="/" end>
                  Home
                </ActiveLink>
                <ActiveLink to="/datasets">Datasets</ActiveLink>
                <ActiveLink to="/dashboards">Dashboards</ActiveLink>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="ml-3 relative">
              <div>
                <Avatar src="https://avatars.githubusercontent.com/u/1904314?v=4" />
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Your Profile
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Settings
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Sign out
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  )
}

export const Layout = () => {
  return (
    <div className="text-gray-700 bg-gray-100 h-full min-h-screen">
      <Nav />
      <Outlet />
    </div>
  )
}
