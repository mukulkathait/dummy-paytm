import { createSlice } from "@reduxjs/toolkit"

const transferSlice = createSlice({
    name: "transfer",
    initialState: {
        hasUser: false,
        userData: null
    },
    reducers: {
        activeTransaction: (state, action) => {
            state.hasUser = true;
            state.userData = action.payload.userData;
        },
        inactiveTransaction: (state) => {
            state.hasUser = false;
            state.userData = null;
        }
    }
})

export const { activeTransaction, inactiveTransaction } = transferSlice.actions;
export default transferSlice.reducer;