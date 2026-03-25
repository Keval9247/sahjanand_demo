import React from 'react'
import { useEffect, useState } from 'react'
import { getMyDomainAPI, deleteDomainAPI } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function UserDomains() {
    const [domains, setDomains] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const fetchDomains = async () => {
        setLoading(true)
        try {
            const response = await getMyDomainAPI()
            const fetchedDomains = response?.data?.domains || []
            setDomains(fetchedDomains)
        } catch (err) {
            console.error('Could not fetch domains:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDomains()
    }, [])

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Confirm delete?')
        if (!confirmed) {
            return
        }

        try {
            await deleteDomainAPI(id)
            await fetchDomains()
        } catch (err) {
            console.error('Error deleting domain:', err)
        }
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Sidebar />
            <main className="p-6 ml-64">
                <header className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">My Domains</h1>
                    <button
                        onClick={() => navigate('/user/create-domain')}
                        className="rounded bg-indigo-600 px-4 py-2 text-white"
                    >
                        Create Domain
                    </button>
                </header>

                {loading && <p>Loading domains...</p>}

                {!loading && domains.length === 0 && <p>No domains yet.</p>}

                {!loading && domains.length > 0 && (
                    <ul className="space-y-2">
                        {domains.map((domain) => (
                            <li key={domain._id} className="flex justify-between rounded bg-white p-3 shadow-sm">
                                <div>
                                    <p className="font-medium">{domain.domainName}</p>
                                    <p className="text-sm text-slate-500">{domain.status || 'unknown'}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(domain._id)}
                                    className="rounded bg-rose-600 px-3 py-1 text-white"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    )
}

export default UserDomains