import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDomainAPI, getMyDomainAPI } from '../utils/api'
import { useEffect } from 'react'
import Sidebar from '../components/Sidebar'

function CreateDomain() {
    const [domainName, setDomainName] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [domains, setDomains] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getMyDomainAPI()
            .then((res) => setDomains(res.data.domains || []))
            .catch(console.error)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            await createDomainAPI({ domainName })
            setMessage('Domain created')
            setDomainName('')
            const r = await getMyDomainAPI()
            setDomains(r.data.domains || [])
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to create domain')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Sidebar />
            <div className="p-6 ml-64">
                <h1 className="text-2xl font-bold mb-4">Create Domain</h1>
                <form onSubmit={handleSubmit} className="max-w-md space-y-4 bg-white p-4 rounded shadow">
                    <input
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        className="w-full rounded border border-slate-300 p-2"
                        placeholder="example.com"
                        required
                    />
                    <button type="submit" disabled={loading} className="w-full rounded bg-indigo-600 p-2 text-white">
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                    {message && <p>{message}</p>}
                </form>

                <section className="mt-6">
                    <h2 className="text-lg font-semibold">Your Domains</h2>
                    <ul className="mt-2 space-y-1">
                        {domains.map((d) => <li key={d._id} className="rounded bg-white p-2 shadow-sm">{d.domainName}</li>)}
                    </ul>
                </section>

                <button onClick={() => navigate('/user/domains')} className="mt-4 text-indigo-600 underline">
                    Back to domains
                </button>
            </div>
        </div>
    )
}

export default CreateDomain