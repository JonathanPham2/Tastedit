import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
// import DishesList from '../components/DishesList';
import LandingPage from '../components/LandingPage';
import CreateDish from '../components/CreateDish';
import DishDetail from '../components/DishDetail';
import ManageDish from '../components/ManageDish';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage/>
      },
      {
        path: "/dishes/new",
        element: <CreateDish/>
      },
      {
        path: "/dishes/:id",
        element: <DishDetail />
      },
      {
        path: "/dishes/current",
        element: <ManageDish/>
      }

      
      
      
    ],
  },
]);