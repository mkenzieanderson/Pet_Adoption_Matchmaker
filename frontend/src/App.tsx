import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { SignInPage } from './pages/SignInPage'
import { HomePage } from './pages/HomePage'
import { MyAccountPage } from './pages/MyAccountPage'
import { PetsPage } from './pages/PetsPage'
import { EditPetPage } from './pages/EditPetPage'
import { AddPetPage } from './pages/AddPetPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ContactPage } from './pages/ContactPage'
import { FaqPage } from './pages/FaqPage'
import './App.css'

export const URL = 'https://animal-adopt-453400.wl.r.appspot.com/';

const routes = createBrowserRouter([
  {path: '/', element: <HomePage />},
  {path: 'pets-page', element: <PetsPage />},
  {path: 'sign-page', element: <SignInPage />},
  {path: 'my-account-page', element: <MyAccountPage />},
  {path: 'edit-pet-page', element: <EditPetPage />},
  {path: 'add-pet-page', element: <AddPetPage />},
  {path: 'contact-page', element: <ContactPage />},
  {path: 'faq-page', element: <FaqPage />}
], {basename: "/Pet-Adoption/"})

function App() {
  return (
    <QueryClientProvider client={new QueryClient}>
      <RouterProvider router={routes} />
    </QueryClientProvider>
  )
}

export default App
