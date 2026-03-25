import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

function Sidebar() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    const adminLinks = [
        { to: '/admin/dashboard', label: "Dashboard" },
        { to: '/admin/users', label: "Users" },
        { to: '/admin/domains', label: "Domains" },
    ]

    const userLinks = [
        { to: '/user/create-domain', label: "Create Domain" },
        { to: '/user/domains', label: "Domains" },
    ]

    const links = user?.role === 'admin' ? adminLinks : userLinks


    return (
        <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-slate-200 p-4">
            <div className="mb-6">
                <h1 className="text-xl font-bold">{user?.role === 'admin' ? 'Admin' : 'User'} Panel</h1>
                <p className="text-sm text-slate-500">{user?.role === 'admin' ? 'Admin portal' : 'User portal'}</p>
            </div>
            <nav className="space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `block rounded px-3 py-2 text-sm ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'}`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-8">
                <button onClick={handleLogout} className="w-full rounded bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700">
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default Sidebar