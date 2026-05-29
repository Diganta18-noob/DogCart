import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { endpoints } from '../apiConfig';
import { toast } from 'react-toastify';
import './AdminViewPets.css';

const petCategories = ['Puppy', 'Adult', 'Medium', 'Senior', 'Small', 'Large'];

const AdminViewPets = () => {
    const [pets, setPets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const petsPerPage = 6;

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const response = await api.get(endpoints.pets);
            setPets(response.data);
        } catch (error) {
            console.error('Error fetching pets:', error);
            toast.error('Failed to fetch pets. Please try again.');
        }
    };

    const filteredPets = pets.filter(pet => {
        const matchesSearch = pet.dogName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.breed?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || pet.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredPets.length / petsPerPage);
    const startIndex = (currentPage - 1) * petsPerPage;
    const currentPets = filteredPets.slice(startIndex, startIndex + petsPerPage);

    const handleDelete = (pet) => {
        setPetToDelete(pet);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!petToDelete) return;
        try {
            await api.delete(endpoints.petById(petToDelete._id));
            setPets(pets.filter(p => p._id !== petToDelete._id));
            toast.success('Pet deleted successfully.');
            setShowDeleteModal(false);
            setPetToDelete(null);
        } catch (error) {
            console.error('Error deleting pet:', error);
            toast.error('Failed to delete pet.');
        }
    };

    return (
        <div className="min-h-screen bg-base-100 relative overflow-hidden bg-grid-pattern pt-24 pb-16 px-4 md:px-8">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 right-1/12 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
            <div className="absolute bottom-1/4 left-1/12 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>

            <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-200/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-lg">
                    <div>
                        <h1 className="text-3xl font-bold font-outfit text-gradient-primary">
                            🐕 Manage Pets
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Add, update, or remove pets from the store inventory.</p>
                    </div>
                    <Link to="/admin/pets/add" className="btn btn-gradient-secondary rounded-xl text-white font-bold px-6 shadow-md shadow-secondary/20">
                        + Add New Pet
                    </Link>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center bg-base-200/30 p-4 rounded-2xl border border-white/5">
                    <div className="relative w-full sm:col-span-2">
                        <input
                            type="text"
                            placeholder="Search by name or breed..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="input-premium pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                    </div>

                    <select 
                        value={categoryFilter} 
                        onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} 
                        className="select-premium"
                    >
                        <option value="">All Categories</option>
                        {petCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                {/* Pets Grid */}
                {currentPets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentPets.map(pet => (
                            <div key={pet._id} className="glass-card flex flex-col h-full bg-base-200/40">
                                {/* Pet Image */}
                                <div className="h-48 relative overflow-hidden rounded-t-2xl bg-base-300">
                                    {pet.coverImage ? (
                                        <img src={pet.coverImage} alt={pet.dogName} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl text-slate-500 bg-slate-800">
                                            🐾
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        {pet.stockQuantity <= 0 ? (
                                            <span className="badge badge-error gap-1 text-white font-semibold">Out of Stock</span>
                                        ) : (
                                            <span className="badge badge-success gap-1 text-white font-semibold">Stock: {pet.stockQuantity}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Pet Info */}
                                <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold font-outfit text-white leading-tight">{pet.dogName}</h3>
                                            <span className="text-primary font-bold text-lg">₹{pet.price?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <span className="badge badge-sm badge-neutral bg-white/5 border-white/10 text-slate-300">Breed: {pet.breed}</span>
                                            <span className="badge badge-sm badge-neutral bg-white/5 border-white/10 text-slate-300">Cat: {pet.category}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                                        <Link to={`/admin/pets/edit/${pet._id}`} className="btn btn-xs btn-outline border-white/10 hover:bg-white/5 text-slate-300 rounded-lg">
                                            Edit
                                        </Link>
                                        <button onClick={() => handleDelete(pet)} className="btn btn-xs btn-error btn-outline rounded-lg">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center flex flex-col items-center gap-3">
                        <span className="text-4xl">🐕</span>
                        <p className="text-slate-300 font-semibold text-lg">No pets found.</p>
                        <p className="text-slate-500 text-sm">Add a new pet to populate this inventory list.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="btn btn-sm btn-outline border-white/10 text-slate-300 disabled:opacity-30 rounded-xl"
                        >
                            ⬅ Prev
                        </button>
                        <span className="text-sm font-semibold text-slate-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="btn btn-sm btn-outline border-white/10 text-slate-300 disabled:opacity-30 rounded-xl"
                        >
                            Next ➡
                        </button>
                    </div>
                )}
            </div>

            {/* Confirm Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card max-w-sm w-full p-8 mx-4 text-center flex flex-col items-center gap-4 animate-scale-in border border-white/10">
                        <div className="w-16 h-16 rounded-full bg-error/15 border border-error/30 text-error flex items-center justify-center text-3xl font-bold shadow-lg shadow-error/10 animate-bounce">
                            ⚠️
                        </div>
                        <h3 className="text-xl font-bold font-outfit text-white mt-2">Confirm Delete</h3>
                        <p className="text-slate-300 text-sm">
                            Are you sure you want to delete <span className="text-error font-semibold">"{petToDelete?.dogName}"</span>? This action is permanent.
                        </p>
                        <div className="flex justify-end gap-3 mt-4 w-full">
                            <button onClick={() => setShowDeleteModal(false)} className="btn btn-ghost btn-sm rounded-lg flex-1">Cancel</button>
                            <button onClick={confirmDelete} className="btn btn-error btn-sm rounded-lg text-white flex-1">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminViewPets;
