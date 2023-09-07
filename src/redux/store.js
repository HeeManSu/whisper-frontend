import { configureStore } from "@reduxjs/toolkit";
// import { userReducer, userSlice } from "./reducers/userReducer";
import { searchSlice, userReducer } from "./reducers/userReducer";
import { chatSlice } from "./reducers/chatSlice";
import { messageSlice } from "./reducers/messageSlice";



export const server = "https://whisper-backend-green.vercel.app/ap1/v1";
const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatSlice.reducer,
        search: searchSlice.reducer,
        message: messageSlice.reducer,
    }
})

export default store;
