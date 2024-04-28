import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import { RootLayout } from './features/layout/components/RootLayout';
import { Signup } from './features/auth/components/Signup';
export const App = () => {

  const router = createBrowserRouter(createRoutesFromElements(
    <>

    <Route path='/' element={<RootLayout/>}/>

    <Route path='/signup' element={<Signup/>}/>
    </>

  ));

  return (
    <RouterProvider router={router}/>
  );
};
