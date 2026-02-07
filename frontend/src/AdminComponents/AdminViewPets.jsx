import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { endpoints } from '../apiConfig';
import { petCategories } from '../mockData'; // Keeping categories mock for now
import './AdminViewPets.css';

const AdminViewPets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
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
        } finally {
            setLoading(false);
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
            setShowDeleteModal(false);
            setPetToDelete(null);
        } catch (error) {
            console.error('Error deleting pet:', error);
            alert('Failed to delete pet');
        }
    };

    return (
        <div className="admin-pets-container">
            <div className="pets-header">
                <h1 className="pets-title">🐕 Manage Pets</h1>
                <Link to="/admin/pets/add" className="add-pet-btn">+ Add New Pet</Link>
            </div>

            <div className="filters-section">
                <input
                    type="text"
                    placeholder="Search pets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="category-select">
                    <option value="">All Categories</option>
                    {petCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            <div className="pets-grid">
                {currentPets.map(pet => (
                    <div key={pet._id} className="pet-card">
                        <div className="pet-image">
                            {pet.coverImage ? <img src={pet.coverImage} alt={pet.dogName} /> : <div className="pet-placeholder">🐾</div>}
                        </div>
                        <div className="pet-info">
                            <h3 className="pet-name">{pet.dogName}</h3>
                            <p className="pet-breed">{pet.breed}</p>
                            <p className="pet-price">₹{pet.price.toLocaleString()}</p>
                            <p className="pet-stock">Stock: {pet.stockQuantity}</p>
                            <span className="pet-category">{pet.category}</span>
                        </div>
                        <div className="pet-actions">
                            <Link to={`/admin/pets/edit/${pet._id}`} className="edit-btn">Edit</Link>
                            <button onClick={() => handleDelete(pet)} className="delete-btn">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete "{petToDelete?.dogName}"?</p>
                        <div className="modal-actions">
                            <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">Cancel</button>
                            <button onClick={confirmDelete} className="confirm-delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminViewPets;
