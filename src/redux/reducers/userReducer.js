import { createAsyncThunk, createReducer, createSlice } from "@reduxjs/toolkit";


export const searchUser = createAsyncThunk('searchUsers', async (search) => {
    try {
        const { data } = await axios.get(`${server}/searchuser`, {
            params: { search }, 
            withCredentials: true,
        });
        return data.users;
    } catch (error) {
        throw new Error(error)
    }
});

export const searchSlice = createSlice({
    name: "search",
    initialState: {
        loading: false,
        isAuthenticated: true,
        users: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(searchUser.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(searchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        });
        builder.addCase(searchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
    }
})

export const userReducer = createReducer({}, {
    loginRequest: state => {
        state.loading = true;
    },
    loginSuccess: (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
    },
    loginFail: (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
    },

    registerRequest: state => {
        state.loading = true;
    },
    registerSuccess: (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
    },
    registerFail: (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
    },

    logoutRequest: state => {
        state.loading = true;
    },
    logoutSuccess: (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.message = action.payload;
    },
    logoutFail: (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = action.payload;
    },

    searchUserRequest: state => {
        state.loading = true;
    },
    searchUserSuccess: (state, action) => {
        state.loading = false;
        state.users = action.payload;
    },
    searchUserFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    loadUserRequest: state => {
        state.loading = true;
    },
    loadUserSuccess: (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
    },
    loadUserFail: (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
    },

    clearError: state => {
        state.error = null;
    },
    clearMessage: state => {
        state.message = null;
    },
    updateProfileRequest: state => {
        state.loading = true;
    },
    updateProfileSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    updateProfileFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    updateProfilePictureRequest: state => {
        state.loading = true;
    },
    updateProfilePictureSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    updateProfilePictureFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
})