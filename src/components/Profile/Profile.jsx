import React from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from "@chakra-ui/react";
import { Avatar, Button } from '@chakra-ui/react'
import { useEffect } from 'react';
import { useState } from 'react';

const Profile = ({ isProfileOpen, ProfileClose }) => {
    const [currentUser, setCurrentUser] = useState();


    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem("userInfo")));
    }, []);

    console.log(currentUser)
    return (
        <div>
            <Modal size={'xl'} isOpen={isProfileOpen} onClose={ProfileClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {/* Add your notification content here */}
                        <div className='flex flex-col gap-3 items-center'>
                            <Avatar src={currentUser?.avatar?.url} size={'xl'} />
                            <h1 className='text-[22px] font-[500]'>{currentUser?.name}</h1>
                            <div className='flex items-center' >
                                <div className='dot bg-green-500  h-[12px] w-[12px] '>

                                </div>
                                <h1 className='text-[21x] pb-1 pl-1'>Online</h1>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={ProfileClose}>
                            Close
                        </Button>
                        {/* Add additional buttons or actions here */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Profile