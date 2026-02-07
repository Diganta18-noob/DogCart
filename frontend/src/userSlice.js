import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
    const storedUser = localStorage.getItem('pawmart_user');
    if (storedUser) {
        try {
            return JSON.parse(storedUser);
        } catch {
            return { isAuthenticated: false, user: null, role: null, token: null };
        }
    }
    return { isAuthenticated: false, user: null, role: null, token: null };
};

const userSlice = createSlice({
    name: 'user',
    initialState: getInitialState(),
    reducers: {
        login: (state, action) => {
            const { user, role, token } = action.payload;
            state.isAuthenticated = true;
            state.user = user;
            state.role = role;
            state.token = token;
            localStorage.setItem('pawmart_user', JSON.stringify(state));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.role = null;
            state.token = null;
            localStorage.removeItem('pawmart_user');
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('pawmart_user', JSON.stringify(state));
        },
    },
});

export const { login, logout, updateUser } = userSlice.actions;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUser = (state) => state.user.user;
export const selectRole = (state) => state.user.role;
export const selectToken = (state) => state.user.token;
export default userSlice.reducer;
