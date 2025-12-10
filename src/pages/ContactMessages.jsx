import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Mail, Search, Trash2, Eye, CheckCircle, Clock, MessageSquare, Phone, Users, FileText, Calendar, AlertCircle, TrendingUp, BarChart3, Info } from 'lucide-react';

import ConfirmationModal from '../components/ConfirmationModal';
import ReplyModal from '../components/ReplyModal';
import ContactDetailsModal from '../components/ContactDetailsModal';
import { fetchContacts, fetchContactStats, updateContactStatus, markAsReplied as markAsRepliedApi, deleteContact as deleteContactApi } from '../api';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterReplyMethod, setFilterReplyMethod] = useState('ALL');

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    // Reply Modal State
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [messageToReply, setMessageToReply] = useState(null);

    // Details Modal State
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        loadMessages();
        loadStats();
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

    const loadStats = async () => {
        try {
            const { data } = await fetchContactStats();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await updateContactStatus(id, newStatus);
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
            loadStats(); // Refresh stats
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const initiateReply = (message) => {
        setMessageToReply(message);
        setIsReplyModalOpen(true);
    };

    const handleReplySubmit = async (replyData) => {
        if (!messageToReply) return;

        try {
            const { data } = await markAsRepliedApi(messageToReply._id, replyData);
            if (data.success) {
                // Update the message in the list
                setMessages(messages.map(msg =>
                    msg._id === messageToReply._id ? data.data : msg
                ));
                setIsReplyModalOpen(false);
                setMessageToReply(null);
                loadStats(); // Refresh stats
            }
        } catch (error) {
            console.error('Error marking as replied:', error);
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

    const getReplyMethodIcon = (method) => {
        switch (method) {
            case 'EMAIL': return <Mail size={16} className="text-blue-600" />;
            case 'WHATSAPP': return <MessageSquare size={16} className="text-green-600" />;
            case 'PHONE': return <Phone size={16} className="text-purple-600" />;
            case 'IN_PERSON': return <Users size={16} className="text-orange-600" />;
            case 'OTHER': return <FileText size={16} className="text-gray-600" />;
            default: return null;
        }
    };

    const filteredMessages = messages.filter(msg => {
        const matchesSearch =
            msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (msg.companyName && msg.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = filterStatus === 'ALL' || msg.status === filterStatus;
        const matchesReplyMethod = filterReplyMethod === 'ALL' || msg.replyMethod === filterReplyMethod;

        return matchesSearch && matchesStatus && matchesReplyMethod;
    });

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Total Messages</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Mail className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Avg Response Time</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.avgResponseTime}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Pending Follow-ups</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.pendingFollowUps}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Calendar className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Overdue Follow-ups</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">{stats.overdueFollowUps}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <AlertCircle className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header and Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    >
                        <option value="ALL">All Status</option>
                        <option value="NEW">New</option>
                        <option value="READ">Read</option>
                        <option value="REPLIED">Replied</option>
                    </select>

                    <select
                        value={filterReplyMethod}
                        onChange={(e) => setFilterReplyMethod(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    >
                        <option value="ALL">All Reply Methods</option>
                        <option value="EMAIL">Email</option>
                        <option value="WHATSAPP">WhatsApp</option>
                        <option value="PHONE">Phone</option>
                        <option value="IN_PERSON">In Person</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
            </div>

            {/* Messages Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Inquiry Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Reply Method</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Follow-up</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                                        Loading messages...
                                    </td>
                                </tr>
                            ) : filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                                        No messages found
                                    </td>
                                </tr>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <tr key={msg._id} className="hover:bg-slate-50 transition group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold text-slate-900">{msg.name}</div>
                                                <div className="text-sm text-slate-500">{msg.email}</div>
                                                <div className="text-sm text-slate-500">{msg.countryCode} {msg.phone}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                {msg.companyName ? (
                                                    <>
                                                        <div className="font-medium text-slate-900">{msg.companyName}</div>
                                                        {msg.industry && <div className="text-slate-500">{msg.industry}</div>}
                                                    </>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900">{msg.inquiryType || 'General Inquiry'}</div>
                                            {msg.timeline && <div className="text-xs text-slate-500 mt-1">{msg.timeline}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(msg.status)}`}>
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {msg.replyMethod ? (
                                                <div className="flex items-center gap-2">
                                                    {getReplyMethodIcon(msg.replyMethod)}
                                                    <span className="text-sm text-slate-700">{msg.replyMethod}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {msg.followUpRequired ? (
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} className={new Date(msg.followUpDate) < new Date() ? 'text-red-600' : 'text-yellow-600'} />
                                                    <span className={`text-xs ${new Date(msg.followUpDate) < new Date() ? 'text-red-600 font-semibold' : 'text-yellow-600'}`}>
                                                        {new Date(msg.followUpDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedContact(msg);
                                                        setIsDetailsModalOpen(true);
                                                    }}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Info size={18} />
                                                </button>
                                                {msg.status !== 'REPLIED' && (
                                                    <button
                                                        onClick={() => initiateReply(msg)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                                        title="Track Reply"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {msg.status === 'NEW' && (
                                                    <button
                                                        onClick={() => updateStatus(msg._id, 'READ')}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Mark as Read"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => initiateDelete(msg._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
            </div>

            {/* Modals */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Message"
                message="Are you sure you want to delete this message? This action cannot be undone."
                confirmText="Delete"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
            />

            <ReplyModal
                isOpen={isReplyModalOpen}
                onClose={() => setIsReplyModalOpen(false)}
                onSubmit={handleReplySubmit}
                contactName={messageToReply?.name}
            />

            <ContactDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                contact={selectedContact}
            />
        </div>
    );
};

export default ContactMessages;
