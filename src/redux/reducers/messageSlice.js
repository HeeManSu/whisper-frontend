import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../store";
// import errorHandlerClass from "../../../backend/utils/errorClass";

export const sendMessages = createAsyncThunk('sendMessage', async ({ content, chatId }) => {
    try {
        const response = await axios.post(`${server}/sendmessage`, {
            content, chatId
        },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            },
        )

        // console.log(response.data)

        return response.data;
    } catch (error) {
        throw new Error("unable to fetch data");
    }
});


export const fetchAllMessages = createAsyncThunk('fetchMessages', async ({ chatId }) => {
    try {
        const { data } = await axios.get(`${server}/${chatId}`, {
            withCredentials: true,
        });

        // console.log(data);
        return data;
    } catch (error) {
        throw new Error("Unable to fetch data");
    }
});



export const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: [],
        allMessages: [],
        notifications: [],
    },

    reducers: {
        setMessages: (state, action) => {
            return { ...state, messages: action.payload.messages }
        },
        clearMessages: (state) => {
            return { ...state, messages: [] };
        },
        setNotifications: (state, action) => {
            return { ...state, notifications: action.payload.notifications }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.chatMessage = action.payload.chatMessage;
                state.error = null;
            })
            .addCase(sendMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchAllMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.allMessages = action.payload.allMessages;
                state.error = null;
            })
            .addCase(fetchAllMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
})


export const { setMessages, clearMessages, setNotifications } = messageSlice.actions;

export default messageSlice.reducer;