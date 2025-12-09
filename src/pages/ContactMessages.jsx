import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Mail, Search, Trash2, Eye, CheckCircle, Clock } from 'lucide-react';

import ConfirmationModal from '../components/ConfirmationModal';
import { fetchContacts, updateContactStatus, deleteContact as deleteContactApi } from '../api';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    // Token is handled by the API interceptor now, so we don't strictly need to select it here for headers
    // but we might want to ensure user is logged in (handled by route protection usually)

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const { data } = await fetchContacts();
            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await updateContactStatus(id, newStatus);
            // Update local state
            setMessages(messages.map(msg =>
                msg._id === id ? { ...msg, status: newStatus } : msg
            ));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const initiateDelete = (id) => {
        setMessageToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!messageToDelete) return;

        try {
            await deleteContactApi(messageToDelete);
            setMessages(messages.filter(msg => msg._id !== messageToDelete));
            setIsDeleteModalOpen(false);
            setMessageToDelete(null);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'READ': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'REPLIED': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-slate-800">Inquiries & Messages</h1>
                    <p className="text-slate-500">Manage contact form submissions from the website</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full md:w-64"
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Sender Details</th>
                                <th className="px-6 py-4">Subject & Message</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        Loading messages...
                                    </td>
                                </tr>
                            ) : filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        No messages found
                                    </td>
                                </tr>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <tr key={msg._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(msg.createdAt).toLocaleDateString()} <br />
                                            <span className="text-xs">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {msg.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-sm">{msg.name}</p>
                                                    <p className="text-xs text-slate-500">{msg.email}</p>
                                                    <p className="text-xs text-slate-500">{msg.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-sm">
                                            <p className="font-semibold text-slate-800 text-sm mb-1">{msg.subject}</p>
                                            <p className="text-sm text-slate-600 line-clamp-2">{msg.message}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(msg.status)}`}>
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {msg.status !== 'REPLIED' && (
                                                    <button
                                                        onClick={() => updateStatus(msg._id, 'REPLIED')}
                                                        className="p-1.5 text-green-600 cursor-pointer hover:bg-green-50 rounded-lg tooltip "
                                                        title="Mark as Replied"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {msg.status === 'NEW' && (
                                                    <button
                                                        onClick={() => updateStatus(msg._id, 'READ')}
                                                        className="p-1.5 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-lg"
                                                        title="Mark as Read"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => initiateDelete(msg._id)}
                                                    className="p-1.5 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
                    <span>Showing {filteredMessages.length} messages</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded bg-white disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded bg-white disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Message"
                message="Are you sure you want to delete this message? This action cannot be undone."
                confirmText="Delete Message"
                isDestructive={true}
            />
        </div>
    );
};

export default ContactMessages;
