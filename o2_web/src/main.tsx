import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { Layout } from "./pages/Layout"
import { Datasets } from "./pages/Datasets"
import { Dashboards } from "./pages/Dashboards"
import { Dataset } from "./pages/DatasetNew"
import { DashboardNew } from "./pages/DashboardNew"
import { DashboardEdit } from "./pages/DashboardEdit"
import { WidgetNew } from "./pages/WidgetNew"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div>
    {/* ensure these classes, used in `index.html`, are compiled by tailwind */}
    <span className="text-gray-700 bg-gray-100"></span>

    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="datasets" element={<Datasets />} />
            <Route path="datasets/new" element={<Dataset />} />
            <Route path="datasets/:id/edit" element={<Dataset />} />

            <Route path="dashboards" element={<Dashboards />} />
            <Route path="dashboards/new" element={<DashboardNew />} />
            <Route path="dashboards/:id/edit" element={<DashboardEdit />} />
            <Route path="dashboards/:dashboardId/widgets/new" element={<WidgetNew />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </div>
)
