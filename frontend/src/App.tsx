import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Protected } from './components/auth/Protected';
import { AuthLayout } from './components/layout/AuthLayout';
import { RootLayout } from './components/layout/RootLayout';
import { useUpdateLogin } from './hooks/useAuth/useUpdateLogin';
import { useInitializeIndexDb } from './hooks/useUtils/useInitializeIndexDb';
import { useSetTheme } from './hooks/useUtils/useSetTheme';
import { ChatPage, ForgotPasswordPage, LoginPage, NotFoundPage, PrivateKeyRecoveryVerificationPage, ResetPasswordPage, SignupPage, VerificationPage } from './pages';
import { useCheckAuthQuery } from './services/api/authApi';
import { selectLoggedInUser } from './services/redux/slices/authSlice';
import { useAppSelector } from './services/redux/store/hooks';
import usePrivateKeyCheck from './hooks/useAuth/usePrivateKeyCheck';
import { selectRecoverPrivateKeyForm } from './services/redux/slices/uiSlice';
import { RecoverPrivateKeyForm } from './components/auth/RecoverPrivateKeyForm';
import { Modal } from './components/shared/Modal';

export const App = () => {

  const recoverPrivateKeyForm = useAppSelector(selectRecoverPrivateKeyForm)

  const {isSuccess,data,isFetching}=useCheckAuthQuery()

  useSetTheme()
  useUpdateLogin(isSuccess,data)
  useInitializeIndexDb()

  usePrivateKeyCheck(isSuccess,data)

  
  const loggedInUser = useAppSelector(selectLoggedInUser)

  const router = createBrowserRouter(createRoutesFromElements(

    <>

    
    <Route path='/' element={<Protected loggedInUser={loggedInUser}><RootLayout/></Protected>}>
        <Route index element={<ChatPage/>}/>
    </Route>

    <Route path='/auth' element={<AuthLayout />}>

      <Route index path='signup' element={
        <Protected loggedInUser={loggedInUser} authorized={false}>
          <SignupPage />
        </Protected>
      } />

      <Route path='login' element={
        <Protected loggedInUser={loggedInUser} authorized={false}>
          <LoginPage />
        </Protected>
      } />

      <Route path='forgot-password' element={
        <Protected loggedInUser={loggedInUser} authorized={false}>
          <ForgotPasswordPage />
        </Protected>
      } />

      <Route path='reset-password' element={
        <Protected loggedInUser={loggedInUser} authorized={false}>
          <ResetPasswordPage />
        </Protected>
      } />

      <Route path='verification' element={
        <Protected loggedInUser={loggedInUser} authorized={true}>
          <VerificationPage/>
        </Protected>
      } />

      <Route path='/auth' element={<Navigate to={'/auth/login'} replace/>}/>
    </Route>


    {/* Catch-all route for 404 page */}
    <Route path='*' element={<NotFoundPage />} />

    </>

  ));

  const privateKeyRecoveryRouter = createBrowserRouter(createRoutesFromElements(

    <>
    <Route path='/auth' element={
        <Modal isOpen={recoverPrivateKeyForm} onClose={()=>""}>
          <RecoverPrivateKeyForm/>
        </Modal>
      }
    />

    <Route path='/auth/privatekey-verification/:recoveryToken' element={<PrivateKeyRecoveryVerificationPage/>}/>

    <Route path='*' element={<Navigate to={'/auth'}/>}/>
    </>

  ))

  return (
    isFetching?''
    :
    <RouterProvider router={
        recoverPrivateKeyForm?
        privateKeyRecoveryRouter:
        router
      }
    />
  )
};
