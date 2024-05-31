import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        status: false,
        userData: null
    },
    reducers: {
        login: (state, action) => {
            state: true;
            userData: action.payload.userData;
        },
        logout: (state) => {
            state: false;
            userData: null;
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;