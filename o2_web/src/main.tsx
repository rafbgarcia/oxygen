import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Widget } from './pages/Widget'
import { Layout } from './pages/Layout'
import { Datasets } from './pages/Datasets'
import { Dashboards } from './pages/Dashboards'
import { Dashboard } from './pages/Dashboard'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="text-gray-750">
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="datasets" element={<Datasets />} />
            <Route path="dashboards" element={<Dashboards />} />
            <Route path="dashboards/:id" element={<Dashboard />} />
            <Route path="dashboards/:id/widgets/:widget_id/edit" element={<Widget />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </div>
)
