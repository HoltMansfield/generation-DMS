import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { RouteTable } from 'routes/RouteTable'

function App() {
  return (
    <BrowserRouter>
      <RouteTable />
    </BrowserRouter>
  )
}

export default App
