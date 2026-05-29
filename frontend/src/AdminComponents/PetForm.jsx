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
            toast.error('Failed to load pet details.');
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

            navigate('/admin/pets');
        } catch (error) {
            console.error('Error saving pet:', error);
            toast.error('Error saving pet: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
                <span className="loading loading-ring loading-lg text-primary"></span>
                <p className="text-slate-400 font-medium">Loading pet data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 relative overflow-hidden bg-grid-pattern pt-24 pb-16 px-4 md:px-8 flex items-center justify-center">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
            <div className="absolute bottom-1/4 right-1/10 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>

            <div className="relative z-10 glass-card max-w-4xl w-full flex flex-col md:flex-row overflow-hidden shadow-2xl transition-all duration-500 border-white/5 bg-base-200/50">
                {/* Background Image / Promo Section */}
                <div className="md:w-5/12 relative bg-base-300 flex items-center justify-center overflow-hidden min-h-[200px] md:min-h-full">
                    <img src={petFormBg} alt="Pet cover illustration" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-base-100/55"></div>
                    <div className="absolute top-8 left-8 text-white z-10">
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-primary px-3 py-1 rounded-full text-white">PawMart Stock</span>
                        <h2 className="text-2xl font-extrabold font-outfit mt-2">Update inventory with love.</h2>
                    </div>
                </div>

                {/* Form Section */}
                <div className="md:w-7/12 p-6 md:p-10 flex flex-col justify-center bg-base-200/40 backdrop-blur-md">
                    <div className="w-full">
                        <h1 className="text-2xl font-extrabold font-outfit text-gradient-primary tracking-tight mb-6">
                            {isEdit ? '✏️ Edit Pet Details' : '➕ Add New Pet'}
                        </h1>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={PetSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ errors, touched, isSubmitting, setFieldValue }) => (
                                <Form className="flex flex-col gap-4 text-slate-300">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Dog Name */}
                                        <div className="form-control w-full">
                                            <label className="label py-0.5">
                                                <span className="label-text text-xs font-semibold text-slate-300">Pet Name*</span>
                                            </label>
                                            <Field
                                                type="text"
                                                name="dogName"
                                                className={`input-premium text-sm py-2 px-3 h-10 ${errors.dogName && touched.dogName ? 'border-error/50' : ''}`}
                                            />
                                            {errors.dogName && touched.dogName && <span className="text-error text-xs mt-1">{errors.dogName}</span>}
                                        </div>

                                        {/* Breed */}
                                        <div className="form-control w-full">
                                            <label className="label py-0.5">
                                                <span className="label-text text-xs font-semibold text-slate-300">Breed*</span>
                                            </label>
                                            <Field
                                                type="text"
                                                name="breed"
                                                className={`input-premium text-sm py-2 px-3 h-10 ${errors.breed && touched.breed ? 'border-error/50' : ''}`}
                                            />
                                            {errors.breed && touched.breed && <span className="text-error text-xs mt-1">{errors.breed}</span>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {/* Age */}
                                        <div className="form-control w-full">
                                            <label className="label py-0.5">
                                                <span className="label-text text-xs font-semibold text-slate-300">Age (Months)*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                name="age"
                                                className={`input-premium text-sm py-2 px-3 h-10 ${errors.age && touched.age ? 'border-error/50' : ''}`}
                                            />
                                            {errors.age && touched.age && <span className="text-error text-xs mt-1">{errors.age}</span>}
                                        </div>

                                        {/* Price */}
                                        <div className="form-control w-full">
                                            <label className="label py-0.5">
                                                <span className="label-text text-xs font-semibold text-slate-300">Price (₹)*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                name="price"
                                                className={`input-premium text-sm py-2 px-3 h-10 ${errors.price && touched.price ? 'border-error/50' : ''}`}
                                            />
                                            {errors.price && touched.price && <span className="text-error text-xs mt-1">{errors.price}</span>}
                                        </div>

                                        {/* Stock Quantity */}
                                        <div className="form-control w-full">
                                            <label className="label py-0.5">
                                                <span className="label-text text-xs font-semibold text-slate-300">Stock Quantity*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                name="stockQuantity"
                                                className={`input-premium text-sm py-2 px-3 h-10 ${errors.stockQuantity && touched.stockQuantity ? 'border-error/50' : ''}`}
                                            />
                                            {errors.stockQuantity && touched.stockQuantity && <span className="text-error text-xs mt-1">{errors.stockQuantity}</span>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                        {/* Category */}
                                        <div className="form-control w-full sm:col-span-1">
                                            <label className="label py-0.5">
                                                <span className="label-text text-xs font-semibold text-slate-300">Category*</span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="category"
                                                className={`select-premium text-sm py-2 px-3 h-10 min-h-[40px] ${errors.category && touched.category ? 'border-error/50' : ''}`}
                                            >
                                                <option value="">Select Category</option>
                                                {petCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </Field>
                                            {errors.category && touched.category && <span className="text-error text-xs mt-1">{errors.category}</span>}
                                        </div>

                                        {/* Cover Image Upload & Preview Box */}
                                        <div className="form-control w-full sm:col-span-2">
                                            <label className="label py-0.5">
                                                <span className="label-text text-xs font-semibold text-slate-300">Upload Cover Image</span>
                                            </label>
                                            <div className="flex gap-3 items-center">
                                                <label className="flex-1 flex flex-col items-center justify-center h-10 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-200">
                                                    <span className="text-xs text-slate-400 font-semibold">Select File</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e, setFieldValue)}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {imagePreview && (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-base-300 flex-shrink-0">
                                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <button 
                                            type="button" 
                                            onClick={() => navigate('/admin/pets')} 
                                            className="btn btn-ghost rounded-xl flex-1 text-slate-400"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting} 
                                            className="btn btn-gradient-primary rounded-xl flex-1 text-white font-bold uppercase tracking-wider"
                                        >
                                            {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Save'}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetForm;
