import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import api, { endpoints } from '../apiConfig';
import './PetForm.css';
import petFormBg from '../assets/images/dogcover.jpg';

const petCategories = ['Puppy', 'Adult', 'Medium', 'Senior', 'Small', 'Large'];

const PetSchema = Yup.object().shape({
    dogName: Yup.string().required('Pet name is required'),
    breed: Yup.string().required('Breed is required'),
    age: Yup.number().min(0, 'Age must be positive').required('Age is required'),
    price: Yup.number().min(1, 'Price must be greater than 0').required('Price is required'),
    stockQuantity: Yup.number().min(0, 'Stock must be positive').required('Stock is required'),
    category: Yup.string().required('Category is required'),
});

const PetForm = ({ isEdit = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(isEdit);
    const [existingPet, setExistingPet] = useState(null);

    useEffect(() => {
        if (isEdit && id) {
            fetchPet();
        }
    }, [isEdit, id]);

    const fetchPet = async () => {
        try {
            const response = await api.get(endpoints.petById(id));
            setExistingPet(response.data);
            if (response.data.coverImage) {
                setImagePreview(response.data.coverImage);
            }
        } catch (error) {
            console.error('Error fetching pet:', error);
            toast.error('Failed to load pet details');
        } finally {
            setLoading(false);
        }
    };

    const initialValues = existingPet ? {
        dogName: existingPet.dogName || '',
        breed: existingPet.breed || '',
        age: existingPet.age || '',
        price: existingPet.price || '',
        stockQuantity: existingPet.stockQuantity || '',
        category: existingPet.category || '',
        coverImage: existingPet.coverImage || ''
    } : {
        dogName: '',
        breed: '',
        age: '',
        price: '',
        stockQuantity: '',
        category: '',
        coverImage: ''
    };

    const handleImageChange = (e, setFieldValue) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFieldValue('coverImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const petData = {
                dogName: values.dogName,
                breed: values.breed,
                age: parseInt(values.age),
                price: parseFloat(values.price),
                stockQuantity: parseInt(values.stockQuantity),
                category: values.category,
                coverImage: values.coverImage || imagePreview || ''
            };

            if (isEdit) {
                await api.put(endpoints.petById(id), petData);
                toast.success('Pet updated successfully!');
            } else {
                await api.post(endpoints.pets, petData);
                toast.success('Pet added successfully!');
            }

            // Navigate after a short delay to allow the toast to be seen, or immediately 
            // since the ToastContainer is in App.jsx it will continue to show.
            // Navigating immediately for better UX.
            navigate('/admin/pets');
        } catch (error) {
            console.error('Error saving pet:', error);
            toast.error('Error saving pet: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading pet data...</div>;
    }

    return (
        <div className="pet-form-container" style={{ backgroundImage: `url(${petFormBg})` }}>
            <div className="pet-form-card">
                <h1 className="form-title">{isEdit ? 'Edit Pet' : 'Add New Pet'}</h1>

                <Formik
                    initialValues={initialValues}
                    validationSchema={PetSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ errors, touched, isSubmitting, setFieldValue }) => (
                        <Form className="pet-form">
                            <div className="form-group">
                                <label>Dog Name *</label>
                                <Field
                                    type="text"
                                    name="dogName"
                                    className={`form-input ${errors.dogName && touched.dogName ? 'input-error' : ''}`}
                                />
                                {errors.dogName && touched.dogName && <span className="error-message">{errors.dogName}</span>}
                            </div>

                            <div className="form-group">
                                <label>Breed *</label>
                                <Field
                                    type="text"
                                    name="breed"
                                    className={`form-input ${errors.breed && touched.breed ? 'input-error' : ''}`}
                                />
                                {errors.breed && touched.breed && <span className="error-message">{errors.breed}</span>}
                            </div>

                            <div className="form-group">
                                <label>Age *</label>
                                <Field
                                    type="number"
                                    name="age"
                                    className={`form-input ${errors.age && touched.age ? 'input-error' : ''}`}
                                />
                                {errors.age && touched.age && <span className="error-message">{errors.age}</span>}
                            </div>

                            <div className="form-group">
                                <label>Price *</label>
                                <Field
                                    type="number"
                                    name="price"
                                    className={`form-input ${errors.price && touched.price ? 'input-error' : ''}`}
                                />
                                {errors.price && touched.price && <span className="error-message">{errors.price}</span>}
                            </div>

                            <div className="form-group">
                                <label>Stock Quantity *</label>
                                <Field
                                    type="number"
                                    name="stockQuantity"
                                    className={`form-input ${errors.stockQuantity && touched.stockQuantity ? 'input-error' : ''}`}
                                />
                                {errors.stockQuantity && touched.stockQuantity && <span className="error-message">{errors.stockQuantity}</span>}
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                <Field
                                    as="select"
                                    name="category"
                                    className={`form-input ${errors.category && touched.category ? 'input-error' : ''}`}
                                >
                                    <option value="">Select Category</option>
                                    {petCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </Field>
                                {errors.category && touched.category && <span className="error-message">{errors.category}</span>}
                            </div>

                            <div className="form-group">
                                <label>Cover Image *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, setFieldValue)}
                                    className="file-input"
                                />
                                {imagePreview && (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={isSubmitting} className="submit-btn">
                                {isSubmitting ? 'Saving...' : isEdit ? 'Update Pet' : 'Add Pet'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default PetForm;
