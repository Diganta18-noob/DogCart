import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
    const storedCart = localStorage.getItem('pawmart_cart');
    if (storedCart) {
        try {
            return JSON.parse(storedCart);
        } catch {
            return { items: [], isOpen: false };
        }
    }
    return { items: [], isOpen: false };
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: getInitialState(),
    reducers: {
        addToCart: (state, action) => {
            const { id, name, price, image, quantity = 1 } = action.payload;
            const existingItem = state.items.find((item) => item.id === id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ id, name, price, image, quantity });
            }
            localStorage.setItem('pawmart_cart', JSON.stringify({ items: state.items, isOpen: state.isOpen }));
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            localStorage.setItem('pawmart_cart', JSON.stringify({ items: state.items, isOpen: state.isOpen }));
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find((item) => item.id === id);
            if (item) {
                item.quantity = quantity;
                if (item.quantity <= 0) {
                    state.items = state.items.filter((i) => i.id !== id);
                }
            }
            localStorage.setItem('pawmart_cart', JSON.stringify({ items: state.items, isOpen: state.isOpen }));
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.setItem('pawmart_cart', JSON.stringify({ items: state.items, isOpen: state.isOpen }));
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        openCart: (state) => {
            state.isOpen = true;
        },
        closeCart: (state) => {
            state.isOpen = false;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectIsCartOpen = (state) => state.cart.isOpen;
export default cartSlice.reducer;
