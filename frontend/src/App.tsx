import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import { RootLayout } from './features/layout/components/RootLayout';
import { Signup } from './features/auth/components/Signup';
import { useCheckAuthQuery } from './features/auth/api';
import { Chat } from './features/chat/components/Chat';
import { Protected } from './features/auth/components/Protected';
export const App = () => {

  const {isLoading} = useCheckAuthQuery()

  const router = createBrowserRouter(createRoutesFromElements(
    <>

    <Route path='/' element={<RootLayout/>}>
        <Route index element={<Protected><Chat/></Protected>}/>
    </Route>

    <Route path='/signup' element={<Signup/>}/>
    </>

  ));

  return (
    <RouterProvider router={router}/>
  );
};
