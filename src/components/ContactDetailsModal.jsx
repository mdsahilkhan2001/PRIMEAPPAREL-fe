import { X, Mail, Phone, Building2, Briefcase, Calendar, Clock, MessageSquare, Globe, TrendingUp, User, FileText } from 'lucide-react';

const ContactDetailsModal = ({ isOpen, onClose, contact }) => {
    if (!isOpen || !contact) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'READ': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'REPLIED': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-in fade-in zoom-in">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-accent/10 to-yellow-50">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Contact Details</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Submitted on {formatDate(contact.createdAt)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex px-3 py-1.5 text-sm font-semibold rounded-full border ${getStatusColor(contact.status)}`}>
                            {contact.status}
                        </span>
                        {contact.followUpRequired && (
                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-full border ${new Date(contact.followUpDate) < new Date()
                                    ? 'bg-red-100 text-red-700 border-red-200'
                                    : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                }`}>
                                <Calendar size={14} />
                                Follow-up: {new Date(contact.followUpDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    {/* Personal Information */}
                    <div className="bg-slate-50 rounded-xl p-5">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <User size={20} className="text-accent" />
                            Personal Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</p>
                                <p className="text-slate-900 font-medium">{contact.name}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Email</p>
                                <p className="text-slate-900 font-medium break-all">{contact.email}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Phone</p>
                                <p className="text-slate-900 font-medium">
                                    {contact.countryCode} {contact.phone}
                                </p>
                            </div>
                            {contact.preferredContactMethod && contact.preferredContactMethod.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Preferred Contact</p>
                                    <div className="flex flex-wrap gap-2">
                                        {contact.preferredContactMethod.map((method, idx) => (
                                            <span key={idx} className="inline-flex px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-md capitalize">
                                                {method}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Company Information */}
                    {(contact.companyName || contact.industry || contact.companySize || contact.companyWebsite) && (
                        <div className="bg-blue-50 rounded-xl p-5">
                            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Building2 size={20} className="text-blue-600" />
                                Company Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {contact.companyName && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Company Name</p>
                                        <p className="text-slate-900 font-medium">{contact.companyName}</p>
                                    </div>
                                )}
                                {contact.companyWebsite && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Website</p>
                                        <a href={contact.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium break-all">
                                            {contact.companyWebsite}
                                        </a>
                                    </div>
                                )}
                                {contact.industry && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Industry</p>
                                        <p className="text-slate-900 font-medium">{contact.industry}</p>
                                    </div>
                                )}
                                {contact.companySize && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Company Size</p>
                                        <p className="text-slate-900 font-medium">{contact.companySize} employees</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Inquiry Details */}
                    <div className="bg-purple-50 rounded-xl p-5">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Briefcase size={20} className="text-purple-600" />
                            Inquiry Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Inquiry Type</p>
                                <p className="text-slate-900 font-medium">{contact.inquiryType || 'General Inquiry'}</p>
                            </div>
                            {contact.timeline && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Timeline</p>
                                    <p className="text-slate-900 font-medium">{contact.timeline}</p>
                                </div>
                            )}
                            {contact.orderVolume && (
                                <div className="md:col-span-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Expected Order Volume</p>
                                    <p className="text-slate-900 font-medium">{contact.orderVolume}</p>
                                </div>
                            )}
                            {contact.referralSource && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">How They Found Us</p>
                                    <p className="text-slate-900 font-medium">{contact.referralSource}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="bg-green-50 rounded-xl p-5">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <MessageSquare size={20} className="text-green-600" />
                            Message
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Subject</p>
                                <p className="text-slate-900 font-medium">{contact.subject}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Message</p>
                                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{contact.message}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reply Information */}
                    {contact.replyMethod && (
                        <div className="bg-orange-50 rounded-xl p-5">
                            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-orange-600" />
                                Reply Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Reply Method</p>
                                    <p className="text-slate-900 font-medium">{contact.replyMethod}</p>
                                </div>
                                {contact.repliedBy && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Replied By</p>
                                        <p className="text-slate-900 font-medium">{contact.repliedBy.name}</p>
                                    </div>
                                )}
                                {contact.repliedAt && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Replied At</p>
                                        <p className="text-slate-900 font-medium">{formatDate(contact.repliedAt)}</p>
                                    </div>
                                )}
                                {contact.replyNotes && (
                                    <div className="md:col-span-2">
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Reply Notes</p>
                                        <p className="text-slate-700 whitespace-pre-wrap">{contact.replyNotes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Reply History */}
                    {contact.replyHistory && contact.replyHistory.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-gray-600" />
                                Reply History
                            </h4>
                            <div className="space-y-3">
                                {contact.replyHistory.map((reply, idx) => (
                                    <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-slate-900">{reply.method}</span>
                                            <span className="text-xs text-slate-500">{formatDate(reply.repliedAt)}</span>
                                        </div>
                                        {reply.repliedBy && (
                                            <p className="text-sm text-slate-600 mb-1">By: {reply.repliedBy.name}</p>
                                        )}
                                        {reply.notes && (
                                            <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{reply.notes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gradient-to-r from-accent to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactDetailsModal;
