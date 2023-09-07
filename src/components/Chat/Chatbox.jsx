import { FiPlusCircle } from "react-icons/fi"
import { Avatar, useDisclosure } from '@chakra-ui/react'
import { BsCheck2All } from "react-icons/bs"
import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from "@chakra-ui/react";
import { Input, Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, searchUser } from '../../redux/actions/user';
import { createNewChat, fetchAllChats } from "../../redux/reducers/chatSlice";
import toast from 'react-hot-toast'
import { useEffect, } from "react";
import Loader from "../Loader/Loader";
import { updateActiveChat } from "../../redux/reducers/chatSlice"



const Chatbox = () => {
  const { isOpen: isPersonModalOpen, onClose: PersonModalClose, onOpen: PersonModalOpen } = useDisclosure();
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState();

  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.search);
  const { message, error, chats } = useSelector(state => state.chat);
  const chatState = useSelector((state) => state.chat);
  // console.log(chats)

  const accessChat = (id) => {
    dispatch(createNewChat(id))
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
    dispatch(loadUser())
  }
  const handleSearchClick = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    dispatch(searchUser(newUsername));
  }

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("userInfo")));
    dispatch(fetchAllChats());
  }, []);

  function getSender(currentUser, users) {
    if (currentUser && currentUser._id) {
      return users[0]._id === currentUser._id ? users[1].name : users[0].name;
    }
    return "";
  }

  function getSenderAvatar(currentUser, users) {
    if (currentUser && currentUser._id) {
      return users[0]._id === currentUser._id ? users[1]?.avatar?.url : users[0]?.avatar?.url;
    }
  }

  return (
    <div className="bg-white rounded-xl shadow1 " >
      <div className="px-5 pt-[6px] ">
        <div className="flex pb-4 justify-between">
          <h1 className="text-[25px] font-[600]">Person</h1>
          <button onClick={PersonModalOpen} type="button">
            <FiPlusCircle className="h-[28px] w-[28px] relative top-[5px]" />
          </button>
          <Modal size={"sm"} isOpen={isPersonModalOpen} onClose={PersonModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form
                >
                  <div className="flex flex-col items-center">
                    <Input
                      required
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter a username"
                      value={username}
                      onChange={handleSearchClick}
                    />
                  </div>
                </form>
                <div className="flex flex-col pt-5">
                  {users && users.length > 0 && username.length !== 0 && users.slice(0, 4).map((user, id) => (
                    <button
                      key={id}
                      onClick={() => accessChat(user._id)}
                      className="border-2 pl-4 bg-white rounded-xl flex shadow1 py-3"
                    >
                      {user.avatar && user.avatar.url ? (
                        <Avatar size='md' src={user.avatar.url} alt={`Avatar of ${user.username}`} />
                      ) : (
                        <Avatar size='md' alt={`Avatar of ${user.username}`} />
                      )}
                      <div className="pl-5 text-start">
                        <h1 className="text-black text-[17px]">{user.username}</h1>
                        <h1 className="text-gray-500">{user.name}</h1>
                      </div>
                    </button>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" type="button" onClick={PersonModalClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div>
          <div className="desktop:h-[250px] 2xl:h-[320px] xl:h-[270px] lg:h-[150px] h-[250px] overflow-scroll scrollbar-hidden" >
            {loading ? (
              <Loader />
            ) : (chats && chats.length > 0 &&
              chats.map((chat, id) => {
                const isLastChat = id === chats.length - 1;
                return (
                  <div onClick={() => dispatch(updateActiveChat({ activeChat: chat }))} className={`${chatState.activeChat === chat ? "bg-[#7dcc81] rounded-lg" : ""} `} key={id}>
                    <div className={`flex justify-between`}>
                      <div className="flex">
                        {chat.avatar && chat.avatar.url ? (
                          <Avatar size='md' src={getSenderAvatar(currentUser, chat?.users)} alt={`Avatar of ${chat.username}`} />
                        ) : (
                          <Avatar size='md' alt={`Avatar of ${chat.username}`} />
                        )}
                        <div className="pl-[14px]">
                          <h1 className="text-[18px] font-[600]" >{getSender(currentUser, chat.users)}</h1>
                          <h1 className="text-[17px] text-green-500">new message</h1>
                        </div>
                      </div>
                      <div className="text-gray-500">5:30 pm</div>
                    </div>
                    {
                      !isLastChat && <div className="border-gray-300 max-w-[98%] mx-auto border my-[8px]"></div>
                    }

                  </div>
                )
              }
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;