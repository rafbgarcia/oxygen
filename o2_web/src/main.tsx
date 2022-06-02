import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"

import { Home } from "./pages/Home"
import { Layout } from "./pages/Layout"
import { Datasets } from "./pages/Datasets"
import { Dashboards } from "./pages/Dashboards"
import { Dataset } from "./pages/DatasetNew"
import { DashboardNew } from "./pages/DashboardNew"
import { DashboardEdit } from "./pages/DashboardEdit"
import { WidgetNew } from "./pages/WidgetNew"
import { EmbeddedDashboard } from "./pages/EmbeddedDashboard"
import { Datasources } from "./pages/Datasources"
import { DatasourcesEdit } from "./pages/DatasourcesEdit"
import { DatasourcesEditTableNew } from "./pages/DatasourcesEditTableNew"
import { DatasourcesEditTableEdit } from "./pages/DatasourcesEditTable"
import { ToastContainer } from "react-toastify"

/**
 * Vendor CSS
 */
import "react-toastify/dist/ReactToastify.css"
import "../node_modules/playbook-ui/dist/playbook.css"

const client = new ApolloClient({
  uri: "http://localhost:8000/",
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="datasets" element={<Datasources />} />
            <Route path="datasets/new" element={<Dataset />} />
            <Route path="datasets/:datasetId" element={<DatasourcesEdit />}>
              <Route path="edit" element={null} />
              <Route path="tables/new" element={<DatasourcesEditTableNew />} />
              <Route path="tables/:tableId" element={<DatasourcesEditTableEdit />} />
            </Route>

            <Route path="dashboards" element={<Dashboards />} />
            <Route path="dashboards/new" element={<DashboardNew />} />
            <Route path="dashboards/:id/edit" element={<DashboardEdit />} />
            <Route path="dashboards/:dashboardId/widgets/new" element={<WidgetNew />} />
          </Route>
          <Route path="/dashboards/:id" element={<EmbeddedDashboard />} />
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
