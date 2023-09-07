import React, { useEffect, useState } from 'react'
import settings from "../../assets/settings.svg"
import chat from "../../assets/chat.svg"
import notification from "../../assets/notification.svg"
import logoutImage from "../../assets/logout.svg"
import { Avatar, Button, Input } from '@chakra-ui/react'
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from "@chakra-ui/react";
import { useDispatch, useSelector } from 'react-redux'
import { loadUser, logout } from '../../redux/actions/user'
import { useNavigate } from 'react-router-dom'
import Profile from '../Profile/Profile'
import Settings from '../Profile/Settings'
import { FiSearch } from "react-icons/fi"
import Chatbox from './Chatbox'
import GroupChatBox from './GroupChatBox'
import SelectedChat from './SelectedChat'
import { updateActiveChat } from '../../redux/reducers/chatSlice'
import callsvg from "../../assets/call.svg"

const Chat = () => {
  const [currentUser, setCurrentUser] = useState();

  const [activeChatIcon, setActiveChatIcon] = useState(false);
  const [activeSettings, setActiveSettings] = useState(false);
  const [activeNotification, setActiveNotification] = useState(false);
  const [activeCall, setActiveCall] = useState(false);
  const [search, setSearch] = useState("");
  const notifications = useSelector((state) => state.message.notifications)
  const [filteredChats, setFilteredChats] = useState([]);

  const { isOpen: isProfileOpen, onClose: ProfileClose, onOpen: ProfileOpen } = useDisclosure();
  const { isOpen: isNotificationOpen, onClose: NotificationClose, onOpen: NotificationOpen } = useDisclosure();
  const { isOpen: isSettingOpen, onClose: SettingClose, onOpen: SettingOpen } = useDisclosure();
  const { isOpen: isCallOpen, onClose: CallClose, onOpen: CallOpen } = useDisclosure();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filterChats = (searchText) => {
    // Filter individual chats
    const filteredIndividualChats = currentUser?.chats?.filter((chat) =>
      chat.chatName.toLowerCase().includes(searchText.toLowerCase())
    );

    // Filter group chats
    const filteredGroupChats = currentUser?.groupChats?.filter((groupChat) =>
      groupChat.chatName.toLowerCase().includes(searchText.toLowerCase())
    );

    // Combine both filtered chats
    const filteredChats = [...filteredIndividualChats, ...filteredGroupChats];
    setFilteredChats(filteredChats);
  };

  useEffect(() => {
    setActiveChatIcon(true);
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value)
  };
  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("userInfo")));
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  }

  console.log(currentUser)

  return (
    <div className='bg-[#DFECF4]'>
      <div className='grid1  xl:h-screen  md:mx-6 mx-3'>
        <div className='my-6 rounded-3xl lg:px-0 px-4 flex py-7 items-center lg:justify-between lg:flex-col flex-row bg-[#6E00FF]'>
          <div className='flex  lg:flex-col flex-row items-center'>
            <button onClick={() => {
              ProfileOpen();
            }}>
              <Avatar
                css={{
                  height: '80px',
                  width: '80px',
                  border: '4px solid #5322BC',
                  borderRadius: '50%',
                  '@media (max-width: 768px)': {
                    height: '50px',
                    width: '50px',
                  }
                }}
                src={currentUser?.avatar?.url} />
              <Profile isProfileOpen={isProfileOpen} ProfileClose={ProfileClose} />
            </button>
            <div className={`xl:pt-16 lg:ml-0 md:ml-5 ml-2 lg:pt-6 flex lg:flex-col flex-row items-center gap-2 md:gap-7 `}>
              <div onClick={() => {
                setActiveChatIcon(true);
                setActiveNotification(false);
                setActiveSettings(false);
                setActiveCall(false);
              }} className={`flex items-center h-[60px]   ${activeChatIcon ? "bg-[#612DD1] border-r-[6px] border-[#F3B559]" : ""}`}>
                <img className='lg:w-44  md:w-32 w-20 h-[34px] flex items-center lg:relative left-1' src={chat} alt="no-image" />
              </div>
              <button onClick={() => {
                NotificationOpen();
                setActiveNotification(true);
                setActiveSettings(false);
                setActiveChatIcon(false);
                setActiveCall(false);
              }} >
                <div className={`flex items-center lg:static relative lg:top-0 top-3 h-[60px]   ${activeNotification ? "bg-[#612DD1] border-r-[6px] border-[#F3B559]" : ""}`}>
                  <img className='lg:w-44 md:w-32 w-20  h-[45px]' src={notification} alt="no-image" />
                </div>
                <span className='bg-white relative lg:left-3 left-2 lg:bottom-14 bottom-12 rounded-full dot' >
                  {notifications.length}
                </span>
                <Modal scrollBehavior='inside' isOpen={isNotificationOpen} onClose={NotificationClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Notification</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <div>
                        {
                          notifications.length == 0 ? (
                            <div className='text-[26px] font-[400] text-center pt-[20px]'>No new notifications</div>
                          ) : (
                            notifications && notifications.length > 0 && notifications.map((noti, id) => {
                              return (
                                <button
                                  key={id}
                                  onClick={() => {
                                    dispatch(updateActiveChat({ activeChat: noti?.chat }))
                                    NotificationClose();
                                  }
                                  }
                                  className="border-2 w-full pl-4 bg-white rounded-xl flex shadow1 py-3"
                                >
                                  {noti?.chat?.avatar && noti?.chat?.avatar?.url ? (
                                    <Avatar size='md' src={noti?.chat?.avatar?.url} alt={`Avatar of ${noti.username}`} />
                                  ) : (
                                    <Avatar size='md' alt={`Avatar of ${noti.username}`} />
                                  )}
                                  <div className="pl-5 text-start">
                                    <h1 className="text-black text-[17px]">{noti?.sender?.name}</h1>
                                    <h1 className="text-gray-500">{noti?.content}</h1>
                                  </div>
                                </button>
                              )
                            })
                          )
                        }
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={NotificationClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </button>
              <button onClick={() => {
                SettingOpen();
                setActiveSettings(true);
                setActiveChatIcon(false);
                setActiveNotification(false);
                setActiveCall(false);
              }}>
                <div className={`flex items-center lg:relative lg:bottom-5 h-[60px]  ${activeSettings ? "bg-[#612DD1] border-r-[6px] border-[#F3B559]" : ""}`}>
                  <img className='lg:w-52 md:w-32 w-20 h-[40px]' src={settings} alt="no-image" />
                </div>

                <Settings isSettingOpen={isSettingOpen} SettingClose={SettingClose} currentUser={currentUser} />
              </button>
              <button onClick={() => {
                CallOpen();
                setActiveCall(true)
                setActiveSettings(false);
                setActiveChatIcon(false);
                setActiveNotification(false);
              }}>
                <div className={`flex items-center lg:mr-0 md:mr-16 lg:relative lg:bottom-5 h-[60px]  ${activeCall ? "bg-[#612DD1] border-r-[6px] border-[#F3B559]" : ""}`}>
                  <img className='lg:w-52 md:w-32 w-20 h-[40px]' src={callsvg} alt="no-image" />
                </div>

                <Modal isOpen={isCallOpen} onClose={CallClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Recent Calls</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <div className='flex justify-center mt-[20px]'>
                        This feature is currently in building.
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="blue" marginTop={12} onClick={CallClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </button>
            </div>
          </div>
          <button onClick={logoutHandler}>
            <img className='h-[42px] w-[42px]' src={logoutImage} alt="" />
          </button>
        </div>
        <div className='my-6  bg-transparent'>
          <div className='flex  gap-6 flex-col'>
            <div>
              <SearchBox search={search} setSearch={setSearch} handleSearch={handleSearch} />
            </div>
            <div>
              <Chatbox />
            </div>
            <div>
              <GroupChatBox />
            </div>
          </div>
        </div>
        <div className='mt-6'>
          <SelectedChat />
        </div>
      </div>
    </div>
  )
}

export default Chat

const SearchBox = ({ search, handleSearch }) => {
  return (
    <div className="flex w-[100%] mx-auto pl-4 py-[5px] shadow1 items-center rounded-[14px] bg-white">
      <FiSearch className='h-[32px] w-[32px] text-[#7c7c7c]' />
      <input
        className='w-full h-full text-[20px] py-2 bg-transparent focus:outline-none border-none  pl-3'
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) =>
          handleSearch(e)
        }
      />
    </div>
  );
};




