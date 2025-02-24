import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { SignInPage } from './pages/SignInPage'
import { HomePage } from './pages/HomePage'
import { MyAccountPage } from './pages/MyAccountPage'
import { PetsPage } from './pages/PetsPage'
import { EditPetPage } from './pages/EditPetPage'
import { AddPetPage } from './pages/AddPetPage'
import './App.css'

export const URL = import.meta.env.VITE_BASE_URL

// For development purposes until bugs with the import.meta.env.VITE_BASE_URL are resolved
// export const URL = 'http://localhost:8080/';

const routes = createBrowserRouter([
  {path: '/', element: <HomePage />},
  {path: 'pets-page', element: <PetsPage />},
  {path: 'sign-page', element: <SignInPage />},
  {path: 'my-account-page', element: <MyAccountPage />},
  {path: 'pets-page', element: <PetsPage />},
  {path: 'edit-pet-page', element: <EditPetPage />},
  {path: 'add-pet-page', element: <AddPetPage />},
])

function App() {
  return <RouterProvider router={routes} />
}

export default App
