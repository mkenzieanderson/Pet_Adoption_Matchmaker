import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ShelterPage } from './pages/shelter.page'
import { SignInPage } from './pages/sign-in.page'
import { HomePage } from './pages/home.page'
import { MyAccountPage } from './pages/my-account.page'
import { PetsPage } from './pages/pets.page'
import { EditPetPage } from './pages/edit-pet.page'
import { AddPetPage } from './pages/add-pet.page'
import './App.css'

const routes = createBrowserRouter([
  {path: '/', element: <HomePage />},
  {path: 'shelter-page', element: <ShelterPage />},
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
