// Mock data for development

export const mockUsers = [
    { id: 1, username: 'demoadmin', email: 'demoadmin@gmail.com', mobile: '1234567890', role: 'admin', password: 'admin123' },
    { id: 2, username: 'demouser', email: 'demouser@gmail.com', mobile: '1234567892', role: 'user', password: 'user123' },
    { id: 3, username: 'demouser2', email: 'demouser2@gmail.com', mobile: '9123456784', role: 'user', password: 'user123' },
];

export const mockPets = [
    { id: 1, name: 'Golden Retriever', breed: 'Gun Dog', age: 1, price: 15408, stock: 8, category: 'Medium', image: null, description: 'Friendly and intelligent family dog' },
    { id: 2, name: 'French Bulldog', breed: 'Non Sporting (AKC 1898)', age: 1, price: 14999, stock: 4, category: 'Puppy', image: null, description: 'Compact and muscular companion dog' },
    { id: 3, name: 'Labrador Retriever', breed: 'Gun Dog (UKC)', age: 3, price: 18998, stock: 7, category: 'Puppy', image: null, description: 'Outgoing, active and friendly' },
    { id: 4, name: 'German Shepherd', breed: 'Herding (AKC 1908, UKC)', age: 2, price: 118999, stock: 11, category: 'Adult', image: null, description: 'Confident, courageous and smart' },
];

export const mockOrders = [
    { id: '68729c6edeb5a682889d007e', userId: 2, status: 'OutForDelivery', total: 62996, shippingAddress: 'demo add', billingAddress: 'demo billing add', date: '12/12025', items: [{ petId: 3, name: 'Labrador Retriever', quantity: 1, price: 18998 }, { petId: 4, name: 'German Shepherd', quantity: 1, price: 118999 }] },
    { id: '68788ebd5a1778780d7e1191', userId: 2, status: 'Pending', total: 114898, shippingAddress: 'demo address blvd', billingAddress: 'demo address blvd CR 04109', date: '11/12025', items: [{ petId: 1, name: 'Golden Retriever', quantity: 1, price: 15408 }, { petId: 2, name: 'French Bulldog', quantity: 2, price: 14999 }] },
    { id: '687b598e6c880a40bba88188', userId: 3, status: 'Pending', total: 144891, shippingAddress: 'demo address', billingAddress: 'demo billing address', date: '10/12025', items: [{ petId: 1, name: 'Golden Retriever', quantity: 2, price: 15408 }] },
];

export const mockReviews = [
    { id: 1, userId: 2, username: 'demouser', petId: 1, petName: 'Golden Retriever', rating: 3, text: 'Excellent service and very friendly staff! My dog loves the quality products from Dog PawMart.', date: '16/1/2025' },
    { id: 2, userId: 2, username: 'demouser', petId: 4, petName: 'German Shepherd', rating: 3, text: 'Good experience overall.', date: '16/1/2025' },
    { id: 3, userId: 3, username: 'demouser2', petId: 1, petName: 'Golden Retriever', rating: 5, text: 'The PawMart are a big hit with my dog!', date: '16/1/2025' },
    { id: 4, userId: 2, username: 'demouser', petId: 3, petName: 'Labrador Retriever', rating: 5, text: 'Great customer service and top-notch selection. Highly recommend!', date: '18/1/2025' },
];

export const mockStats = {
    totalUsers: mockUsers.filter(u => u.role === 'user').length,
    totalPets: mockPets.length,
    totalOrders: mockOrders.length,
    totalReviews: mockReviews.length,
};

export const petCategories = ['Puppy', 'Adult', 'Medium', 'Senior'];
export const orderStatuses = ['Pending', 'Confirmed', 'OutForDelivery', 'Delivered', 'Cancelled'];
