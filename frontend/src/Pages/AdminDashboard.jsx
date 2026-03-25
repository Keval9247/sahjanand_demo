import React from 'react'
import { useEffect } from 'react'
import { getAllDomainAPI, getAllUserAPI } from '../utils/api'
import { useAuth } from '../context/Authcontext'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'

function AdminDashboard() {
    const { user } = useAuth()
    const [users, setUsers] = useState([]);
    const [domains, setdomains] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllUserAPI(), getAllDomainAPI()])
            .then(([u, d]) => {
                setUsers(u.data.users || []);
                setdomains(d.data.domains || []);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [])

    return (
        <div className="min-h-screen bg-slate-100">
            <Sidebar />
            <main className="p-6 ml-64">
                <h2 className="text-2xl font-bold mb-4">Welcome back, {user?.name}</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg bg-white p-4 shadow">Users: {users.length}</div>
                        <div className="rounded-lg bg-white p-4 shadow">Domains: {domains.length}</div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default AdminDashboard