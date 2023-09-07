import { createReducer } from "@reduxjs/toolkit";


export const userReducer = createReducer(
    {
        name: 'user',
        initialState: {
            loading: false,
            chat: null,
            message: null,
            error: null,
        },
    }, {
    reducers: {
        newPersonChatRequest: state => {
            state.loading = true;
        },
            newPersonChatSuccess: (state, action) => {
                state.loading = false;
                state.chat = action.payload.chat;
                state.successMessage = action.payload.message; // Update the state property for success message
            },
        newPersonChatFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});