import { useAuth } from './context/Authcontext'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './Pages/AdminDashboard'
import AdminUsers from './Pages/AdminUsers'
import AdminDomains from './Pages/AdminDomains'
import CreateDomain from './Pages/CreateDomain'
import UserDomains from './Pages/UserDomains'

function App() {

  const RootRedirect = () => {
    const { user, loading } = useAuth();
    if (loading) return null
    if (!user) return <Navigate to="/login" replace />
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/domains'} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<RootRedirect />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role='admin'>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role='admin'>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/domains"
          element={
            <ProtectedRoute role='admin'>
              <AdminDomains />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/domains"
          element={
            <ProtectedRoute role='user'>
              <UserDomains />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/create-domain"
          element={
            <ProtectedRoute role='user'>
              <CreateDomain />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to='/' replace />} />
      </Routes>
    </div>
  )
}

export default App;
