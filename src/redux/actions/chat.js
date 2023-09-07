import { server } from "../store";
import axios from "axios";

export const getAllPersonChats = (username = "") => async dispatch => {
    try {

        const config = {
            withCredentials: true,
        };
        dispatch({ type: 'allPersonChatRequest' });

        const { data } = await axios.get(
            `${server}/personchat?username=${username}`, config

        );
        // console.log(data)
        dispatch({ type: 'allPersonChatSuccess', payload: data.chats });
    } catch (error) {
        dispatch({ type: 'allPersonChatFail', payload: error.response.data.message });
    }
}


export const createPersonChat = (secondUserId) => async dispatch => {
    try {
        const config = {
            withCredentials: true,
        };
        dispatch({ type: 'newPersonChatRequest' });

        const { data } = await axios.post(
            `${server}/personchat`, 
            { secondUserId },
            config

        );
        // console.log(data)

        dispatch({
            type: 'newPersonChatSuccess',
            payload: {
                chat: data.chat,
                message: data.message
            }
        });    } catch (error) {
        dispatch({ type: 'newPersonChatFail', payload: error.response.data.message });
    }
}
