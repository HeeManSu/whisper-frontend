import { Avatar, Tooltip } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import ScrollableFeed from 'react-scrollable-feed'


const ScrollableChat = ({allMessages}) => {
    const [currentUser, setCurrentUser] = useState();
    const activeChat = useSelector((state) => state.chat.activeChat);

    useEffect(() => {
        const userFromLocalStorage = JSON.parse(localStorage.getItem("userInfo"));
        if (userFromLocalStorage) {
            setCurrentUser(userFromLocalStorage);
        }
    }, []);

    const isSameSender = (allMessages, message, index, userId) => {
        return (
            index < allMessages?.length - 1 &&
            (allMessages[index + 1]?.sender?._id !== message?.sender?._id ||
                allMessages[index + 1]?.sender?._id === undefined
            ) && allMessages[index]?.sender?._id !== userId
        );
    };
    const isLastMessage = (allMessages, index, userId) => {
        return (
            index === allMessages?.length - 1 &&
            allMessages[allMessages.length - 1]?.sender?._id !== userId &&
            allMessages[allMessages.length - 1]?.sender?._id
        );
    };
    
    const isSameSenderMargin = (allMessages, message, index, userId) => {
        if (
            index < allMessages?.length - 1 &&
            allMessages[index + 1]?.sender &&
            allMessages[index + 1].sender._id === message?.sender?._id &&
            allMessages[index]?.sender?._id !== userId
        ) {
            return 33;
        } else if (
            (index < allMessages?.length - 1 &&
                allMessages[index + 1]?.sender &&
                allMessages[index + 1].sender._id !== message?.sender?._id &&
                allMessages[index]?.sender?._id !== userId)
            || (
                index === allMessages?.length - 1 &&
                allMessages[index]?.sender?._id !== userId
            )
        ) {
            return 0;
        } else {
            return "auto";
        }
    }

    const isSameUser = (allMessages, message, index) => {
        return index > 0 && allMessages[index - 1]?.sender?._id === message?.sender?._id;
    }


    function getSenderAvatar(currentUser, users) {
        if (currentUser && currentUser?._id) {
            return users[0]?._id === currentUser?._id ? users[1]?.avatar?.url : users[0]?.avatar?.url;
        }
    }


    return (
        <ScrollableFeed>
            {allMessages && allMessages.map((message, index) => (
                <div style={{ display: "flex" }} key={index}>

                    {(isSameSender(allMessages, message, index, currentUser?._id) || isLastMessage(allMessages, index, currentUser?._id)) && (
                        <Tooltip
                            label={message?.sender?.name}
                            placement='bottom-start'
                            hasArrow
                        >
                            <Avatar
                                mt="7px"
                                mr={1}
                                cursor='pointer'
                                name={message?.sender?.name}
                                src={getSenderAvatar(currentUser, activeChat?.users)}
                            />
                        </Tooltip>
                    )}
                    <span
                        style={{
                            backgroundColor: `${message?.sender?._id === currentUser?._id ? "#BEE3F8" : "#B9F5D0"}`,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(allMessages, message, index, currentUser?._id),
                            marginTop: isSameUser(allMessages, message, index, currentUser?._id) ? 3 : 10,
                        }}
                    >
                        {message.content}
                    </span>
                </div>
            ))
            }
        </ScrollableFeed >
    );
};

export default ScrollableChat;
