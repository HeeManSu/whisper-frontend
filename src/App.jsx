import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import ResetPassword from './components/Auth/ResetPassword'
import ForgetPassword from './components/Auth/ForgetPassword'
import Chat from './components/Chat/Chat'
// import Home from './components/Home/Home'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { ProtectedRoute } from 'protected-route-react'
import { loadUser } from './redux/actions/user'
import Loader from './components/Loader/Loader'

function App() {

  window.addEventListener('contextmenu', e => {
    e.preventDefault();
  })

  const { isAuthenticated, user, message, error, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }

    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
  }, [dispatch, error, message]);

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])


  return (
    <Router>

      {
        loading ? (<Loader />) : (
          <>
            <Routes>
              <Route path='/' element={
                <ProtectedRoute
                  isAuthenticated={!isAuthenticated}
                  redirect="/chat"
                >
                  <Login />
                </ProtectedRoute>} />
              <Route path='/register' element={
                <ProtectedRoute
                  isAuthenticated={!isAuthenticated}
                  redirect="/chat"
                >
                  <Register />
                </ProtectedRoute>
              } />
              <Route path='/resetpassword' element={
                <ProtectedRoute
                  isAuthenticated={!isAuthenticated}
                  redirect="/login"
                >
                  <ResetPassword />
                </ProtectedRoute>
              } />
              <Route path='/forgetpassword' element={
                <ProtectedRoute
                  isAuthenticated={!isAuthenticated}
                  redirect="/login"
                >
                  <ForgetPassword />
                </ProtectedRoute>
              } />
              <Route path='/chat' element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Chat />
                </ProtectedRoute>

              } />
            </Routes>
          </>
        )
      }

      <Toaster />
    </Router>
  )
}

export default App
