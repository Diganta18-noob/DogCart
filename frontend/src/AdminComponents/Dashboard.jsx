import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api, { endpoints } from '../apiConfig';
import './Dashboard.css';

const Dashboard = () => {
    // Fetch dashboard stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const response = await api.get(endpoints.dashboardStats);
            return response.data;
        }
    });

    // Fetch users list
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['dashboardUsers'],
        queryFn: async () => {
            const response = await api.get(endpoints.dashboardUsers);
            return response.data;
        }
    });

    const statCards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, color: '#8b5cf6' },
        { title: 'Total Pets', value: stats?.totalPets || 0, color: '#14b8a6' },
        { title: 'Total Orders', value: stats?.totalOrders || 0, color: '#f97316' },
        { title: 'Total Reviews', value: stats?.totalReviews || 0, color: '#ec4899' },
    ];

    if (statsLoading || usersLoading) {
        return (
            <div className="dashboard-container">
                <h1 className="dashboard-title">Admin Dashboard</h1>
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Admin Dashboard</h1>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="stat-card"
                        style={{ backgroundColor: stat.color }}
                    >
                        <span className="stat-label">{stat.title}</span>
                        <span className="stat-value">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="users-section">
                <h2 className="section-title">Users List</h2>
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Mobile Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.mobileNumber}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="no-data">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
