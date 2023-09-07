import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../store";
// import errorHandlerClass from "../../../backend/utils/errorClass";


export const createNewChat = createAsyncThunk(
    'createNewChat',
    async (secondUserId) => {
        try {
            const response = await axios.post(
                `${server}/personchat`,
                { secondUserId },
                {
                    withCredentials: true
                }
            );
            return response.data;

        } catch (error) {
            throw new Error(error);
        }
    }
);

export const fetchAllChats = createAsyncThunk('fetchAllChat', async () => {
    try {
        const response = await axios.get(`${server}/personchat`,
            {
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error);
    }
})

export const addToGroup = createAsyncThunk('addToGroup', async ({chatId, userId}) => {
    try {
        const response = await axios.put(`${server}/groupadd`,
            {
                chatId,
                userId
            },
            {
                withCredentials: true,
            })

        return response.data;
    } catch (error) {
        throw new Error(error);
    }
})

export const createGroupChat = createAsyncThunk('createGroupChat', async (formData) => {
    try {
        const response = await axios.post(
            `${server}/groupchat`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        // console.log('Response:', response.data);
        return response.data;

    } catch (error) {
        console.error('Action Creator Error:', error);
        // throw new errorHandlerClass("unable to fetch data", 400);
        throw new Error("Unable to fetch data")
    }
});

export const fetchAllGroupChats = createAsyncThunk('fetchAllGroupChat', async () => {
    try {
        const response = await axios.get(`${server}/groupchat`,
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
})

export const renameGroupChat = createAsyncThunk('updateGroupChat', async ({ newChatName, chatId }) => {

    // console.log("new chat name:", newChatName)
    // console.log("chat id:", chatId)
    try {
        const response = await axios.put(`${server}/rename`,
            { newChatName, chatId },
            {
                withCredentials: true,
                // headers: {
                //     'Content-Type': 'application/json',
                // },
            }
        );
        // console.log("response data:", response.data);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
})
export const removeGroupUser = createAsyncThunk('removeGroupUser', async ({ userId, chatId }) => {

    // console.log("new chat name:", newChatName)
    // console.log("chat id:", chatId)
    try {
        const response = await axios.put(`${server}/groupremove`,
            { userId, chatId },
            {
                withCredentials: true,
                // headers: {
                //     'Content-Type': 'application/json',
                // },
            }
        );
        console.log("response data:", response.data);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
})


export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        // chat: null,
        // loading: false,
        // error: null,
        // message: null,
        // chats: null,
        activeChat: null,
        groupUsers: [],
    },
    reducers: {
        updateActiveChat: (state, action) => {
            return { ...state, activeChat: action.payload.activeChat };
        },
        updateGroupUsers: (state, action) => {
            return { ...state, groupUsers: action.payload.groupUsers }
        },
        resetGroupUsers: (state) => {
            return { ...state, groupUsers: [] };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNewChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(createNewChat.fulfilled, (state, action) => {
                state.loading = false;
                state.chat = action.payload.chat;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(createNewChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchAllChats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload.chats;
            })
            .addCase(fetchAllChats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(addToGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createGroupChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(createGroupChat.fulfilled, (state, action) => {
                state.loading = false;
                state.newChat = action.payload.newChat;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(createGroupChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchAllGroupChats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllGroupChats.fulfilled, (state, action) => {
                state.loading = false;
                state.groupChats = action.payload.groupChats;
            })
            .addCase(fetchAllGroupChats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(renameGroupChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(renameGroupChat.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedChatName = action.payload.updatedChatName;
                state.message = action.payload.message;
            })
            .addCase(renameGroupChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeGroupUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeGroupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.removed = action.payload.removed;
                state.message = action.payload.message;
            })
            .addCase(removeGroupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { updateActiveChat, updateGroupUsers, resetGroupUsers } = chatSlice.actions;

export default chatSlice.reducer;