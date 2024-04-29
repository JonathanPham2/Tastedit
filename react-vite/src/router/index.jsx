import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
// import DishesList from '../components/DishesList';
import LandingPage from '../components/LandingPage';
import CreateDish from '../components/CreateDish';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage/>
      },
      {
        path: "/new",
        element: <CreateDish/>
      },
      
      
      
    ],
  },
]);