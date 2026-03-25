import React from 'react'
import { useState } from 'react';
import { adminDeleteDomainAPI, assignDomainAPI, getAllDomainAPI, getAllUserAPI } from '../utils/api';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';

function AdminDomains() {
    const [domains, setdomains] = useState([]);
    const [users, setusers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ userId: '', domainName: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);


    const fetchData = async () => {
        try {
            const [d, u] = await Promise.all([getAllDomainAPI(), getAllUserAPI()])
            setdomains(d.data.domains || []);
            setusers((u.data.users || []).filter((u) => u.role === 'user'));
        } catch (error) {
            console.log('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchData(); }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this domain')) return;

        try {
            await adminDeleteDomainAPI(id);
            setdomains(domains.filter((d) => d._id !== id));
        } catch (error) {
            console.log('Error deleting domain:', error);
        }
    }


    const handleAssign = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await assignDomainAPI(form);
            await fetchData();
            setShowModal(false);
            setForm({ userId: '', domainName: '' });
        } catch (error) {
            console.log('Error assigning domain:', error);
            setError(error.response?.data?.message || 'Failed to assign domain');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Sidebar />
            <main className="p-6 ml-64">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Domain management</h2>
                    <button
                        onClick={() => { setError(''); setShowModal(true); }}
                        className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
                    >
                        Assign domain
                    </button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : domains.length === 0 ? (
                    <p>No domain available.</p>
                ) : (
                    <div className="overflow-x-auto bg-white rounded shadow">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    {['Domain Name', 'Owner', 'Email', 'Source', 'Status', 'Actions'].map((h) => (
                                        <th key={h} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {domains.map((d) => (
                                    <tr key={d._id} className="border-t">
                                        <td className="px-4 py-2">{d?.domainName}</td>
                                        <td className="px-4 py-2">{d?.userId?.name || '-'}</td>
                                        <td className="px-4 py-2">{d?.userId?.email || '-'}</td>
                                        <td className="px-4 py-2">{d?.assignedByAdmin ? 'Admin' : 'User'}</td>
                                        <td className="px-4 py-2">{d?.status}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleDelete(d._id)}
                                                className="rounded bg-rose-600 px-3 py-1 text-sm text-white hover:bg-rose-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
                        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded bg-white p-6 shadow-xl">
                            <h3 className="text-xl font-semibold mb-4">Assign domain to user</h3>
                            {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

                            <form onSubmit={handleAssign} className="space-y-4">
                                <div>
                                    <label htmlFor="user" className="block text-sm font-medium text-slate-700">Select User</label>
                                    <select
                                        id="user"
                                        value={form.userId}
                                        onChange={(e) => setForm({ ...form, userId: e.target.value })}
                                        required
                                        className="mt-1 w-full rounded border border-slate-300 p-2"
                                    >
                                        <option value="">Choose a user</option>
                                        {users.map((u) => (
                                            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="domain" className="block text-sm font-medium text-slate-700">Domain name</label>
                                    <input
                                        id="domain"
                                        type="text"
                                        value={form.domainName}
                                        onChange={(e) => setForm({ ...form, domainName: e.target.value })}
                                        required
                                        className="mt-1 w-full rounded border border-slate-300 p-2"
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="rounded border border-slate-300 px-3 py-1">Cancel</button>
                                    <button type="submit" disabled={submitting} className="rounded bg-indigo-600 px-3 py-1 text-white">
                                        {submitting ? 'Assigning...' : 'Assign'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}


export default AdminDomains