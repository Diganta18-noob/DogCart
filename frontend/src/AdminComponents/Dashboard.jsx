import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api, { endpoints } from '../apiConfig';
import './Dashboard.css';

const Dashboard = () => {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const response = await api.get(endpoints.dashboardStats);
            return response.data;
        }
    });

    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['dashboardUsers'],
        queryFn: async () => {
            const response = await api.get(endpoints.dashboardUsers);
            return response.data;
        }
    });

    const statCards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, color: 'before:bg-indigo-500 text-indigo-400', icon: '👤' },
        { title: 'Total Pets', value: stats?.totalPets || 0, color: 'before:bg-teal-500 text-teal-400', icon: '🐕' },
        { title: 'Total Orders', value: stats?.totalOrders || 0, color: 'before:bg-amber-500 text-amber-400', icon: '📦' },
        { title: 'Total Reviews', value: stats?.totalReviews || 0, color: 'before:bg-rose-500 text-rose-400', icon: '💬' },
    ];

    if (statsLoading || usersLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
                <span className="loading loading-ring loading-lg text-primary"></span>
                <p className="text-slate-400 font-medium">Loading dashboard stats...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 relative overflow-hidden bg-grid-pattern pt-24 pb-16 px-4 md:px-8">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/12 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
            <div className="absolute bottom-1/4 right-1/12 w-[350px] h-[350px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>

            <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-gradient-primary">
                        📊 Admin Dashboard
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Overview of PawMart status, registration metrics, and inventory counts.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <div key={index} className={`stat-card-premium ${stat.color} border-white/5 bg-base-200/40`}>
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{stat.title}</span>
                                    <span className="text-3xl font-extrabold font-outfit text-white">{stat.value}</span>
                                </div>
                                <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/5">{stat.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Users Section */}
                <div className="glass-card p-6 md:p-8 border-white/5 bg-base-200/40 flex flex-col gap-6">
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                        <h2 className="text-xl font-bold font-outfit text-slate-200">
                            Registered Customers
                        </h2>
                        <span className="badge badge-primary font-semibold text-xs text-white">
                            {users?.length || 0} Registered
                        </span>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email Address</th>
                                    <th>Mobile Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user._id}>
                                            <td className="font-semibold text-slate-200 flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 font-bold text-xs uppercase">
                                                        {user.username.charAt(0)}
                                                    </div>
                                                </div>
                                                {user.username}
                                            </td>
                                            <td className="text-slate-300 font-medium">{user.email}</td>
                                            <td className="text-slate-400">{user.mobileNumber || 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-slate-500 text-center py-6">
                                            No customers registered yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
