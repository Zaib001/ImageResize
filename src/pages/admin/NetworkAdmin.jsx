import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Mail,
    Calendar,
    Trash2,
    Search,
    Download,
    RefreshCw,
    UserPlus
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NetworkAdmin = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${API_URL}/network/admin/members`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMembers(response.data);
        } catch (error) {
            console.error('Failed to fetch members:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this member from the network?')) return;

        setDeletingId(id);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_URL}/network/admin/members/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMembers(members.filter(m => m._id !== id));
        } catch (error) {
            console.error('Failed to delete member:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const filteredMembers = members.filter(m =>
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportCSV = () => {
        const headers = ['Email', 'Joined Date'];
        const rows = members.map(m => [m.email, new Date(m.joinedAt).toLocaleString()]);
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "intelligence_network_members.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-[#F63049] uppercase">
                        Expert <span className="opacity-30">Collective</span>
                    </h1>
                    <p className="text-[#8A244B]/40 text-xs font-bold uppercase tracking-[0.4em] mt-3">
                        Intelligence Network Membership Directory
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={exportCSV}
                        className="flex items-center space-x-2 px-6 py-4 bg-white border border-[#F63049]/10 text-[#F63049] rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm hover:bg-[#F63049]/5 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={fetchMembers}
                        className="p-4 bg-[#F63049] text-white rounded-2xl shadow-lg shadow-[#F63049]/20 hover:rotate-180 transition-all duration-700"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-[#F63049]/5 flex items-center space-x-6">
                    <div className="w-14 h-14 bg-[#F63049]/5 rounded-2xl flex items-center justify-center border border-[#F63049]/10">
                        <Users className="w-7 h-7 text-[#F63049]" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/30 mb-1">Total Members</p>
                        <h3 className="text-3xl font-black text-[#F63049] tracking-tighter">{members.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-[#F63049]/5 flex items-center space-x-6">
                    <div className="w-14 h-14 bg-[#8A244B]/5 rounded-2xl flex items-center justify-center border border-[#8A244B]/10">
                        <UserPlus className="w-7 h-7 text-[#8A244B]" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#8A244B]/30 mb-1">Joined Today</p>
                        <h3 className="text-3xl font-black text-[#8A244B] tracking-tighter">
                            {members.filter(m => new Date(m.joinedAt).toDateString() === new Date().toDateString()).length}
                        </h3>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-[#8A244B]/20" />
                    </div>
                    <input
                        type="text"
                        placeholder="SEARCH COLLECTIVE..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-full bg-white border border-[#F63049]/5 rounded-[32px] pl-16 pr-8 py-8 text-sm font-black text-[#8A244B] focus:border-[#F63049] outline-none transition-all placeholder:text-[#8A244B]/20 shadow-sm"
                    />
                </div>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-[40px] border border-[#F63049]/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#F63049]/5 bg-[#F63049]/[0.02]">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#8A244B]/40">Expert Identity</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#8A244B]/40">Timestamp</th>
                                <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-[#8A244B]/40">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F63049]/5">
                            <AnimatePresence>
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <motion.tr
                                            key={member._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group hover:bg-[#F63049]/[0.01] transition-colors"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F63049]/10 to-transparent flex items-center justify-center">
                                                        <Mail className="w-5 h-5 text-[#F63049]/40 group-hover:text-[#F63049] transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-[#F63049] text-sm tracking-tight">{member.email}</p>
                                                        <p className="text-[9px] font-bold text-[#8A244B]/30 uppercase tracking-widest mt-1">Verified Node</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-2 text-[11px] font-bold text-[#8A244B]/60">
                                                    <Calendar className="w-3.5 h-3.5 opacity-20" />
                                                    <span>{new Date(member.joinedAt).toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button
                                                    onClick={() => handleDelete(member._id)}
                                                    disabled={deletingId === member._id}
                                                    className="p-3 text-[#8A244B]/20 hover:text-[#F63049] hover:bg-[#F63049]/5 rounded-xl transition-all"
                                                >
                                                    {deletingId === member._id ? (
                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-10 py-32 text-center">
                                            <div className="flex flex-col items-center space-y-4 opacity-20">
                                                <Users className="w-12 h-12" />
                                                <p className="text-xs font-black uppercase tracking-widest">Collective Database Empty</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NetworkAdmin;
