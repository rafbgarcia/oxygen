import { Home } from './pages/Home'
import { Widget } from './pages/Widget'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="text-gray-750">
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/widgets/:id" element={<Widget />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </div>
)
