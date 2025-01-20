import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ShelterPage } from './pages/shelter.page'
import ViteSample from './pages/vite.page'
import './App.css'

const routes = createBrowserRouter([
  {path: '/', element: <ViteSample />},
  {path: 'shelter-page', element: <ShelterPage />}
])

function App() {
  return <RouterProvider router={routes} />
}

export default App
