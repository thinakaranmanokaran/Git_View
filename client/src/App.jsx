import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'

const App = () => {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  )
}

export default App