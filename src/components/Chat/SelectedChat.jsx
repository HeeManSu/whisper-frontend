import { Avatar, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, Input, ModalCloseButton, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from 'react-redux';
import { addToGroup, fetchAllGroupChats, removeGroupUser, renameGroupChat, resetGroupUsers, updateGroupUsers } from '../../redux/reducers/chatSlice';
import { RxCross2 } from "react-icons/rx"
import { IoMdCall } from "react-icons/io"
import { BsFillCameraVideoFill } from "react-icons/bs"
import { loadUser, searchUser } from '../../redux/actions/user';
import { useRef } from 'react';
import toast from 'react-hot-toast'
import Loader from '../Loader/Loader';
import { fetchAllMessages, sendMessages, setMessages, setNotifications } from '../../redux/reducers/messageSlice';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"
// import Lottie from 'react-lottie';
import Lottie from 'lottie-web';
import animationData from "../../Animations/typing.json"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react'
import Puneet from "../../assets/puneet.jpg"


const ENDPOINT = "https://whisper-backend-green.vercel.app/api/v1";
var socket, activeChatCompare;

const SelectedChat = () => {
  const activeChat = useSelector((state) => state.chat.activeChat);
  const notifications = useSelector((state) => state.message.notifications)
  const messages = useSelector((state) => state.message.messages)
  const { isOpen: isPersonModalOpen, onClose: PersonModalClose, onOpen: PersonModalOpen } = useDisclosure();
  const { isOpen: isGroupModalOpen, onClose: GroupModalClose, onOpen: GroupModalOpen } = useDisclosure();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false)

  const [content, setcontent] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const { error, allMessages, loading } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const animationContainer = React.useRef(null);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("setup", currentUser);
    });
    socket.on("error", (error) => {
      console.error("Socket.io connection error:", error);
    });
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))
    return () => {
      socket.disconnect();
    };
  }, [currentUser]);


  const sendMessage = async (event) => {
    if (event.key === 'Enter' && content) {
      event.preventDefault();
      socket.emit("stop typing", activeChat._id);
      const { payload } = await dispatch(sendMessages({ content, chatId: activeChat?._id }));
      // console.log(payload?.chatMessage)

      dispatch(setMessages({
        messages: [...messages
          , payload?.chatMessage]
      }))
      setcontent("");

      socket.emit('new message', payload?.chatMessage)
    }
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
  };
  useEffect(() => {
    socket.on("messsage received", (newMessageReceived) => {
      if (!activeChatCompare || activeChatCompare._id !== newMessageReceived?.chat?._id) {

        try {
          if (!notifications.includes(newMessageReceived)) {
            dispatch(setNotifications({ notifications: [newMessageReceived, ...notifications] }))
            // console.log("notifications")
            // console.log(notifications)
          }
        } catch (error) {
          return console.log("no notification")
        }

      } else {
        dispatch(setMessages({ messages: [...messages, newMessageReceived] }))
        // console.log("new message added")
      }
    })
  }, [messages, sendMessage])

  // console.log("notification active chat:", activeChat)


  const fetchMessages = async () => {
    if (!activeChat) {
      return;
    }
    const { payload } = await dispatch(fetchAllMessages({ chatId: activeChat?._id }))
    dispatch(setMessages({
      messages: payload?.allMessages || []
    }));
    socket.emit("join chat", activeChat?._id);
  }

  useEffect(() => {
    fetchMessages();
    dispatch(setMessages({ messages: [] }));
    activeChatCompare = activeChat;
  }, [activeChat]);


  const typingHandler = (e) => {
    setcontent(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", activeChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", activeChat._id);
        setTyping(false);
      }
    }, timerLength)
  }

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("userInfo")));
  }, []);

  const getSenderName = (currentUser, users) => {
    if (currentUser && currentUser._id) {
      const senderName = activeChat ? (users[0]._id === currentUser._id ? users[1]?.name : users[0]?.name) : "";
      return senderName || "Puneet 1"; // Return senderName if it's available, otherwise "admin1"
    }
    return "Puneet 1"; // Return "admin1" when currentUser is not available
  }


  const getSenderAvatar = (currentUser, users) => {
    if (currentUser && currentUser._id) {
      const senderAvatar = activeChat ? (users[0]._id === currentUser._id ? users[1]?.avatar?.url : users[0]?.avatar?.url) : "";
      return senderAvatar || Puneet

    }
    return Puneet;
  }

  const handleModal = () => {
    if (activeChat && !activeChat.isGroupChat) {
      PersonModalOpen();
    } else {
      GroupModalOpen();
    }
  };

  React.useEffect(() => {
    const animation = Lottie.loadAnimation({
      container: animationContainer.current, // Use the ref for the container
      renderer: 'svg', // You can change the renderer as needed
      loop: true,
      autoplay: true,
      animationData: animationData, // Replace with your animation data
    })
  });

  return (
    <div className='bg-white rounded-xl shadow1 xl:h-[97%] h-[94%] lg:pb-0 pb-5'>
      {activeChat ? (
        <div className='px-[30px] pt-[20px]'>
          <div className='flex justify-between'>
            <div className='flex cursor-pointer gap-4 items-center'>

              <Avatar size="md" src={activeChat?.isGroupChat ? (activeChat?.avatar.url) : (getSenderAvatar(currentUser, activeChat?.users))} />
              <h1 className='text-[18px] flex items-center font-[500]'>{activeChat?.isGroupChat ? (activeChat?.chatName) : (getSenderName(currentUser, activeChat?.users))}</h1>
            </div>

            <div className='flex gap-6 items-center mt-2'>
              <Popover>
                <PopoverTrigger>
                  <Button background={'white'}>
                    <IoMdCall className='text-blue-600 text-[30px]' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader pt={3}>Note: </PopoverHeader>
                  <PopoverBody pt={4}>This feature is currently in building.</PopoverBody>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger>
                  <Button background={'white'}>
                    <BsFillCameraVideoFill className='text-blue-600 text-[30px]' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader pt={3}>Note: </PopoverHeader>
                  <PopoverBody pt={4}>This feature is currently in building.</PopoverBody>
                </PopoverContent>
              </Popover>
              <BsThreeDotsVertical
                onClick={handleModal}
                className=' cursor-pointer'
                size="27px"
              />
            </div>

          </div>
          <div className='bg-gray-400 h-[1.5px] mt-[10px]'></div>
          {
            loading ? (
              <Loader />
            ) : (
              <div className='bg-blue-50  mt-[5px]'>
                <div className={` ${isTyping ? 'desktop:h-[74vh] 2xl:h-[72vh]  xl:h-[72vh] lg:h-[69vh] ' : 'desktop:h-[76vh] 2xl:h-[76vh] xl:h-[76vh]  lg:h-[69vh] h-[500px] '}  w-full hide-scrollbar`} >
                  {
                    allMessages && <ScrollableChat allMessages={messages} />
                  }
                </div>
              </div>
            )
          }
          <form onKeyDown={sendMessage}>
            {
              isTyping ? <div ref={animationContainer} className='bg-blue-50'>
                {/* <Lottie

                  height={35}
                  width={70}
                  style={{
                    marginBottom: 0,
                    marginLeft: 0
                  }}
                  options={defaultOptions}
                /> */}
              </div> : (<></>)
            }
            <Input
              paddingY='5'
              placeholder='Enter the message'
              boxShadow='0px 4px 5px 2px rgba(121, 197, 239, 0.38)'
              onChange={typingHandler}
              value={content}
            />
          </form>
        </div>
      ) : (
        <div className='flex items-center justify-center h-[300px]'>No chat selected</div>
      )}
      <ProfileModal activeChat={activeChat} isOpen={isPersonModalOpen} onClose={PersonModalClose} />
      <GroupProfileModal activeChat={activeChat} isOpen={isGroupModalOpen} onOpen={isGroupModalOpen} onClose={GroupModalClose} />
    </div>
  );
};

export default SelectedChat;

const ProfileModal = ({ activeChat, isOpen, onClose }) => {
  return (
    <Modal size={"md"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className='flex gap-4 flex-col items-center'>
            <div className='text-[20px] font-[500]'></div>
            <Avatar size="2xl" src={activeChat?.avatar?.url} />
            <div className='text-[18px]'>{activeChat?.users[1]?.email}</div>
          </div>

        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const GroupProfileModal = ({ activeChat, isOpen, onClose, onOpen }) => {

  const dispatch = useDispatch();
  const groupUsers = useSelector((state) => state.chat.groupUsers);
  const [newChatName, setNewChatName] = useState("");
  const [newUserName, setNewUserName] = useState("");

  const { message, error, loading } = useSelector(state => state.chat);
  const { users } = useSelector(state => state.search)

  const updateButtonRef = useRef(null);


  // useEffect(() => {
  //   if (activeChat?.users && JSON.stringify(activeChat.users) !== JSON.stringify(groupUsers)) {
  //     dispatch(updateGroupUsers({ groupUsers: activeChat.users }));
  //   }
  // }, [activeChat?.users]);

  const handleDeleteFunction = async (userId, chatId) => {
    try {
      const action = await dispatch(removeGroupUser({ userId, chatId }));
      const { removed, message } = action.payload;

      // console.log(removed)

      if (removed) {
        // Handle successful removal
        toast.success(message);
        // You can dispatch a reset action here to clear the removed user from your local state if needed.
        // dispatch(updateGroupUsers({ groupUsers: groupUsers.filter((user) => user._id !== userId) }));
      } else {
        // Handle error
        toast.error(message);
      }
    } catch (error) {
      // Handle any errors thrown during the API request
      console.error('Error:', error);
      toast.error('An error occurred while removing the user.');
    }
  };
  const changeGroupNameHandler = (newChatName, chatId) => {
    // console.log(newChatName, chatId);
    dispatch(renameGroupChat({ newChatName, chatId }));
    onClose();
    dispatch(loadUser())

    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
  };

  const handleSearchClick = (e) => {
    const newUsername = e.target.value;
    setNewUserName(newUsername);
    dispatch(searchUser(newUsername));
  }

  const addToGroupHandler = (chatId, userId, user) => {

    dispatch(addToGroup({ chatId, userId }))
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
  }

  const handleCloseModal = () => {
    dispatch(resetGroupUsers());
    onClose();
  };


  return (
    <Modal scrollBehavior='inside' size={"md"} isOpen={isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Group Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className='flex flex-col'>
            <h1 className='text-[25px] text-center font-[600]'>{activeChat?.chatName}</h1>
            <div className='flex pl-[12px] flex-wrap gap-2 mt-[9px]'>
              {
                activeChat?.users && activeChat?.users?.length > 0 && activeChat?.users?.map((user, id) => {
                  return (
                    <div key={id} className="bg-blue-600  gap-2 flex justify-center pl-[12px] pb-[5px] items-center text-white px-[8px] py-[3px] text-center rounded-full">
                      <h1>{user.name}</h1>
                      <RxCross2 className="cursor-pointer" onClick={() => handleDeleteFunction(user._id, activeChat?._id)} />
                    </div>
                  )
                })
              }
            </div>
            <div className='flex justify-around mt-[10px]'>
              <Input
                marginTop={8}
                w="70%"
                required
                id="newChatName"
                name="newChatName"
                type="text"
                placeholder="Enter new chatname"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    updateButtonRef.current.click();
                  }
                }}
              />
              <Button
                marginTop={8}
                isLoading={loading}
                ref={updateButtonRef}
                type='button'
                colorScheme='blue'
                onClick={() => changeGroupNameHandler(newChatName, activeChat?._id)}
              >
                Update
              </Button>
            </div>
            <Input
              marginTop={4}
              required
              id='newUserName'
              name='newUserName'
              type='text'
              placeholder='Add new users'
              value={newUserName}
              onChange={handleSearchClick}
            />
            <div className="flex flex-col pt-5">
              {users && users.length > 0 && newUserName?.length !== 0 && users.slice(0, 4).map((user, id) => (
                <button
                  key={id}
                  onClick={() => addToGroupHandler(activeChat._id, user._id, user)}
                  className="border-2 pl-4 bg-white rounded-xl flex shadow1 py-3"
                >
                  {user?.avatar && user?.avatar?.url ? (
                    <Avatar size='md' src={user?.avatar?.url} alt={`Avatar of ${user?.username}`} />
                  ) : (
                    <Avatar size='md' alt={`Avatar of ${user?.username}`} />
                  )}
                  <div className="pl-5 text-start">
                    <h1 className="text-black text-[17px]">{user?.username}</h1>
                    <h1 className="text-gray-500">{user?.name}</h1>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={handleCloseModal}>
            Leave Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}


const UserItem = ({ user, deleteFunction }) => {
  const handleDeleteClick = () => {
    deleteFunction(user._id);
  };
  return (
    <div className="bg-blue-600 gap-2 flex justify-center pl-[12px] pb-[5px] items-center text-white px-[8px] py-[3px] text-center rounded-full">
      <h1>{user.name}</h1>
      <RxCross2 className="cursor-pointer" onClick={handleDeleteClick} />
    </div>
  );
}

