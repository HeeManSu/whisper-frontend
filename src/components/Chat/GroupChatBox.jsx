import { FiPlusCircle } from "react-icons/fi"
import { Avatar, useDisclosure } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from "@chakra-ui/react";
import { Input, Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, searchUser } from '../../redux/actions/user';
import { RxCross2 } from "react-icons/rx"
import toast from 'react-hot-toast'
import { createGroupChat, fetchAllGroupChats, updateGroupUsers } from "../../redux/reducers/chatSlice";
import Loader from "../Loader/Loader";
import { updateActiveChat } from "../../redux/reducers/chatSlice"


const GroupChatBox = () => {
    const { isOpen: isGroupModalOpen, onClose: GroupModalClose, onOpen: GroupModalOpen } = useDisclosure();
    const [username, setUsername] = useState("");
    const [chatName, setChatName] = useState('');
    // const [groupUsers, setGroupUsers] = useState([]);
    const [image, setImage] = useState()
    const dispatch = useDispatch();
    const { users } = useSelector(state => state.search);
    const { message, error, groupChats, loading } = useSelector(state => state.chat);
    const groupUsers = useSelector((state) => state.chat.groupUsers);
    // console.log(groupChats);

    const chatState = useSelector((state) => state.chat);

    const changeImageHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(file);
        }
    }

    const handleGroupAdd = (user) => {
        if (groupUsers.includes(user)) {
            return toast.success("User already added");
        }
        dispatch(updateGroupUsers({ groupUsers: [...groupUsers, user] }))
    }

    const handleDeleteFunction = (userId) => {
        // console.log(userId); // Check if userId is logged correctly
        const updatedGroupUsers = groupUsers.filter((user) => user._id !== userId);
        // console.log(updatedGroupUsers); // Check the updated groupUsers array
        dispatch(updateGroupUsers({ groupUsers: updatedGroupUsers }));
    };

    const handleSearchClick = async (e) => {
        e.preventDefault();
        setUsername(e.target.value)
        dispatch(searchUser(e.target.value))
    }


    const createGroupHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', chatName);
        formData.append('file', image);
        formData.append('users', JSON.stringify(groupUsers.map((u) => u._id)));
        GroupModalClose();
        dispatch(createGroupChat(formData));

        toast.success("New Group Chat created. Refresh to see changes 👍")

        if (error) {
            toast.error(error);
            dispatch({ type: 'clearError' });
        }
        if (message) {
            toast.success(message);
            dispatch({ type: 'clearMessage' });
        }
    }


    useEffect(() => {
        dispatch(fetchAllGroupChats());
    }, [dispatch]);



    return (
        <div className="bg-white rounded-xl shadow1 " >
            <div className="px-5 pt-[6px] ">
                <div className="flex pb-4 justify-between">
                    <h1 className="text-[25px] font-[600]">Group</h1>
                    <button onClick={GroupModalOpen} type="button">
                        <FiPlusCircle className="h-[28px] w-[28px] relative top-[5px]" />
                    </button>
                    <Modal scrollBehavior="inside" size={"sm"} isOpen={isGroupModalOpen} onClose={GroupModalClose}>
                        <ModalOverlay />
                        <ModalContent  >
                            <ModalHeader>New Group Chat</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody >
                                <form>
                                    <div className="flex flex-col items-center">
                                        <Input
                                            required
                                            id="chatName"
                                            name="chatName"
                                            type="text"
                                            placeholder="Enter Chatname"
                                            value={chatName}
                                            onChange={(e) => setChatName(e.target.value)}
                                        />
                                        <Input
                                            required
                                            style={{ marginTop: '12px' }}
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="Search Users"
                                            value={username}
                                            onChange={handleSearchClick}
                                        />
                                        <div>
                                            <h1 className='py-[6px] text-[15px] font-[600]'>Choose dp</h1>
                                            <Input
                                                accept='image/*'
                                                required
                                                id='choose avatar'
                                                type='file'
                                                css={{
                                                    cursor: 'pointer',
                                                    marginLeft: '-5%',
                                                    width: '110%',
                                                    border: 'none',
                                                    height: '100%',
                                                    color: '#0000FF',
                                                    backgroundColor: 'white',
                                                }}
                                                // css={fileUploadStyle}
                                                onChange={changeImageHandler}
                                            />
                                        </div>
                                    </div>
                                </form>
                                <div className="flex pl-[12px] flex-wrap gap-2 mt-[9px]">
                                    {loading ? (
                                        <Loader />
                                    ) : (
                                        groupUsers.map((user, id) => (
                                            <UserItem user={user} deleteFunction={handleDeleteFunction} key={id} />
                                        ))
                                    )}
                                </div>
                                <div className="flex flex-col pt-5">
                                    {users && users.length > 0 && username.length !== 0 && users.slice(0, 3).map((user, id) => (
                                        <button
                                            key={id}
                                            onClick={() => handleGroupAdd(user)}
                                            className="border-2 pl-4 bg-white rounded-xl flex shadow1 py-3"
                                        >
                                            <Avatar size='md' src={user.avatar.url} alt={`Avatar of ${user.username}`} />
                                            <div className="pl-5 text-start">
                                                <h1 className="text-black text-[17px]">{user.username}</h1>
                                                <h1 className="text-gray-500">{user.name}</h1>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" type="submit" onClick={createGroupHandler} >
                                    Create Chat
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                </div>
                <div>
                    <div className="desktop:h-[280px]  lg:h-[180px] h-[200px] overflow-scroll scrollbar-hidden" >
                        {groupChats && groupChats.length > 0 &&
                            groupChats.map((groupChat, id) => {
                                const isLastChat = id === groupChats.length - 1;
                                const updatedAtDate = new Date(groupChat.updatedAt);
                                const hours = updatedAtDate.getHours();
                                const minutes = updatedAtDate.getMinutes();

                                const formattedTime = `${hours}:${minutes}`;

                                // console.log(groupChats.length)
                                return (
                                    <div onClick={() => dispatch(updateActiveChat({ activeChat: groupChat }))} className={`${chatState.activeChat === groupChat ? "bg-[#7dcc81] rounded-lg" : ""} `} key={id}>
                                        <div className="flex justify-between">
                                            <div className="flex">
                                                {groupChat.avatar && groupChat.avatar.url ? (
                                                    <Avatar size='md' src={groupChat.avatar.url} alt={`Avatar of ${groupChat.username}`} />
                                                ) : (
                                                    <Avatar size='md' alt={`Avatar of ${groupChat.username}`} />
                                                )}
                                                <div className="pl-[14px]">
                                                    <h1 className="text-[18px] font-[600]" >{groupChat.chatName}</h1>
                                                    <h1 className="text-[17px] text-green-500">new message</h1>
                                                </div>
                                            </div>


                                            <div className="text-gray-500">{formattedTime}</div>
                                        </div>
                                        {
                                            !isLastChat && <div className="border-gray-300 max-w-[98%] mx-auto border my-[8px]"></div>
                                        }

                                    </div>
                                )
                            }
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupChatBox


export const UserItem = ({ user, deleteFunction }) => {
    const handleDeleteClick = () => {
        deleteFunction(user._id);

    };
    // console.log(user)

    return (
        <div className="bg-blue-600  gap-2 flex justify-center pl-[12px] pb-[5px] items-center text-white px-[8px] py-[3px] text-center rounded-full">
            <h1>{user.name}</h1>
            <RxCross2 className="cursor-pointer" onClick={handleDeleteClick} />
        </div>
    );
}
