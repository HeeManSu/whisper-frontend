import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../store";
import axios from "axios";


export const login = (username, password) => async dispatch => {
    try {
        dispatch({ type: 'loginRequest' });

        const { data } = await axios.post(
            `${server}/login`,
            { username, password }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        );
        const user = data.user;
        // console.log(user);

        localStorage.setItem("userInfo", JSON.stringify(user));

        dispatch({ type: 'loginSuccess', payload: data });
    } catch (error) {
        dispatch({ type: 'loginFail', payload: error.response.data.message });
    }
}


export const loadUser = () => async dispatch => {
    try {
        dispatch({ type: 'loadUserRequest' });

        const { data } = await axios.get(
            `${server}/me`,
            {
                withCredentials: true,
            }
        );
        const user = data.user;
        localStorage.setItem("userInfo", JSON.stringify(user));
        dispatch({ type: 'loadUserSuccess', payload: data.user });
        console.log(data)
    } catch (error) {
        // dispatch({ type: 'loadUserFail', payload: error.response.data.message });
        throw new Error(error)
    }
};

export const register = formdata => async dispatch => {
    try {
        dispatch({ type: 'registerRequest' });

        const { data } = await axios.post(
            `${server}/register`, formdata, {
            headers: {
                'Content-type': 'multipart/form-data',
            },
            withCredentials: true,
        },

        );
        dispatch({ type: 'registerSuccess', payload: data });
    } catch (error) {
        dispatch({ type: 'registerFail', payload: error.response.data.message });
    }
};

export const logout = () => async dispatch => {
    try {
        dispatch({ type: 'logoutRequest' });

        const { data } = await axios.get(`${server}/logout`, {
            withCredentials: true,
        });
        dispatch({ type: 'logoutSuccess', payload: data.message });
    } catch (error) {
        dispatch({ type: 'logoutFail', payload: error.response.data.message });
    }
};


export const searchUser = createAsyncThunk('searchUsers', async (search) => {
    try {
        // dispatch({ type: 'searchUserRequest' });

        const { data } = await axios.get(`${server}/searchuser`, {
            params: { search }, // Pass the search query as a parameter
            withCredentials: true,
        });
        // console.log(data.users);

        // dispatch({ type: 'searchUserSuccess', payload: data.users }); // Use "data.users" for the payload
        return data.users;
    } catch (error) {
        // dispatch({ type: 'searchUserFail', payload: error.response.data.message });
        throw new Error(error)
    }
});


export const updateProfilePicture = formdata => async dispatch => {
    try {
        dispatch({ type: 'updateProfilePictureRequest' });
        const { data } = await axios.put(
            `${server}/updateprofilepicture`,
            formdata,
            {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
                withCredentials: true,
            }
        );
        dispatch({ type: 'updateProfilePictureSuccess', payload: data.message });

    } catch (error) {
        dispatch({
            type: 'updateProfilePictureFail',
            payload: error.response.data.message,
        });
    }
};


export const updateProfile = (email) => async dispatch => {
    try {
        dispatch({ type: 'updateProfileRequest' });

        const { data } = await axios.put(
            `${server}/updateprofile`,
            {
                email,
            },
            {
                headers: {
                    'Content-type': 'application/json',
                },

                withCredentials: true,
            }
        );

        dispatch({ type: 'updateProfileSuccess', payload: data.message });
    } catch (error) {
        dispatch({
            type: 'updateProfileFail',
            payload: error.response.data.message,
        });
    }
};


export const changePassword = (oldPassword, newPassword) => async dispatch => {
    try {
        dispatch({ type: 'changePasswordRequest' });

        const { data } = await axios.put(
            `${server}/changepassword`,
            {
                oldPassword,
                newPassword,
            },
            {
                headers: {
                    'Content-type': 'application/json',
                },

                withCredentials: true,
            }
        );

        dispatch({ type: 'changePasswordSuccess', payload: data.message });
    } catch (error) {
        dispatch({
            type: 'changePasswordFail',
            payload: error.response.data.message,
        });
    }
};