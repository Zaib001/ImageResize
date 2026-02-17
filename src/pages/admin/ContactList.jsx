import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Search, Trash2, CheckCircle, Clock } from 'lucide-react';
import { contactService } from '../../services/contactService';
import { Link } from 'react-router-dom';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [expandedMessages, setExpandedMessages] = useState(new Set());

    useEffect(() => {
        fetchContacts();
    }, [page, refreshTrigger]);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const data = await contactService.getContacts({ page, limit: 10 });
            setContacts(data.data);
            setTotalPages(data.pagination.pages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            await contactService.deleteContact(id);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    const handleMarkAsRead = async (id, currentStatus) => {
        const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
        try {
            await contactService.updateContactStatus(id, newStatus);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const toggleMessage = (id) => {
        setExpandedMessages(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const renderMessageContent = (contact) => {
        const isExpanded = expandedMessages.has(contact._id);
        const isLong = contact.message.length > 100 || contact.message.split(/\s+/).length > 20;

        return (
            <div className="text-xs">
                <p className={`text-[#8A244B]/50 transition-all duration-300 break-words whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {contact.message}
                </p>
                {isLong && (
                    <button
                        onClick={() => toggleMessage(contact._id)}
                        className="text-[#D02752] font-bold mt-1 hover:underline focus:outline-none block"
                    >
                        {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#5e112d]">Messages</h1>
                    <p className="text-[#8A244B]/60">Manage incoming inquiries</p>
                </div>
            </div>

            <div className="bg-white rounded-[30px] border border-[#D02752]/10 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#D02752]/10 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[#8A244B]/50 text-xs font-bold uppercase tracking-wider border-b border-[#D02752]/5">
                                <th className="pb-4 pl-4">Status</th>
                                <th className="pb-4">Sender</th>
                                <th className="pb-4 pr-12">Subject</th>
                                <th className="pb-4 pl-4">Date</th>
                                <th className="pb-4 text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D02752]/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-[#8A244B]/50">Loading messages...</td>
                                </tr>
                            ) : contacts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-[#8A244B]/50">No messages found.</td>
                                </tr>
                            ) : (
                                contacts.map((contact) => (
                                    <tr key={contact._id} className="group hover:bg-[#F63049]/[0.02] transition-colors">
                                        <td className="py-4 pl-4">
                                            <button
                                                onClick={() => handleMarkAsRead(contact._id, contact.status)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${contact.status === 'unread'
                                                    ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
                                                    : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                                                    }`}
                                            >
                                                {contact.status}
                                            </button>
                                        </td>
                                        <td className="py-4 font-medium text-[#5e112d]">
                                            <div className="flex flex-col">
                                                <span>{contact.name}</span>
                                                <span className="text-xs text-[#8A244B]/50 font-normal">{contact.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-12 min-w-[300px] max-w-md text-[#8A244B]/80">
                                            <p className="font-medium text-sm mb-1">{contact.subject}</p>
                                            {renderMessageContent(contact)}
                                        </td>
                                        <td className="py-4 pl-4 text-sm text-[#8A244B]/60">
                                            {new Date(contact.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 pr-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleDelete(contact._id)}
                                                className="p-2 rounded-xl text-[#F63049] hover:bg-[#F63049]/10 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-[#D02752]/10 flex justify-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-[#8A244B] disabled:opacity-50 hover:bg-[#F63049]/5"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-sm font-medium text-[#8A244B]/50">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-[#8A244B] disabled:opacity-50 hover:bg-[#F63049]/5"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactList;
