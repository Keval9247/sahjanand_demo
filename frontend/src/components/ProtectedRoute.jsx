import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

function ProtectedRoute({ role, children }) {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">Loading...</div>
        )
    }

    if (!user) return <Navigate to={'/login'} replace />

    if (role && user.role !== role) {
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/domains'} replace />
    }
    return children;
}

export default ProtectedRoute