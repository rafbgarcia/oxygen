import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import { ToastContainer } from "react-toastify"

import { Layout } from "./pages/Layout"
import { Home } from "./pages/Home"

import { DatasetList } from "./pages/Dataset/DatasetList"
import { DatasetEdit } from "./pages/Dataset/DatasetEdit"
import { DatasetTableNew } from "./pages/Dataset/DatasetTableNew"
import { DatasetTableShow } from "./pages/Dataset/DatasetTableShow"

import { DashboardIndex } from "./pages/Dashboard/DashboardIndex"
import { DashboardEdit } from "./pages/Dashboard/DashboardEdit"
import { WidgetEdit } from "./pages/Widget/WidgetEdit"

/**
 * Page to display dashboard in Nitro
 */
import { EmbeddedDashboard } from "./pages/EmbeddedDashboard"

/**
 * Vendor CSS
 */
import "react-toastify/dist/ReactToastify.css"
import "playbook-ui/dist/playbook.css"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

const client = new ApolloClient({
  uri: "http://localhost:8000/",
  cache: new InMemoryCache({
    typePolicies: {
      Dashboard: {
        fields: {
          layout: {
            merge: (existing, incoming) => incoming,
          },
          widgets: {
            merge: (existing, incoming) => incoming,
          },
        },
      },
    },
  }),
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="datasets" element={<DatasetList />} />
            <Route path="datasets/:datasetId" element={<DatasetEdit />}>
              <Route path="edit" element={null} />
              <Route path="tables/new" element={<DatasetTableNew />} />
              <Route path="tables/:tableId" element={<DatasetTableShow />} />
            </Route>

            <Route path="dashboards" element={<DashboardIndex />} />
            <Route path="dashboards/:dashboardId" element={<DashboardEdit />}>
              <Route path="edit" element={null} />
              <Route path="widgets/:widgetId/edit" element={<WidgetEdit />} />
            </Route>
          </Route>

          <Route path="embed/:dashboardId" element={<EmbeddedDashboard />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>

    <ToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </React.StrictMode>
)
