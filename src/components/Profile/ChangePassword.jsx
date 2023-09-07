import React, { useState } from 'react'
import { Input, Button } from '@chakra-ui/react'
// import { changePassword } from '../../redux/actions/profile';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { changePassword } from '../../redux/actions/user';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from "@chakra-ui/react";

const ChangePassword = ({ isOpen,
    onClose,
}) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const dispatch = useDispatch();
    const handleSubmit = e => {
        e.preventDefault();
        dispatch(changePassword(oldPassword, newPassword));
        onClose();

        toast.success("Password changed successfully");
      
    };

    const { loading, message, error } = useSelector(state => state.user);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: 'clearError' });
        }
        if (message) {
            toast.success(message);
            dispatch({ type: 'clearMessage' });
        }
    }, [dispatch, error, message]);


    return (
        <div className='flex flex-col justify-center h-screen items-center '>
            <div className='sm:w-[22%] w-[82%]'>
                <Modal isOpen={isOpen} onClose={onClose}>
                    {/* <ModalOverlay  /> */}
                    <ModalContent>
                        <ModalHeader>Change Password</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <form onSubmit={handleSubmit}>
                                <div className='flex gap-4 flex-col  '>
                                    <Input
                                        required
                                        placeholder='Old Password'
                                        value={oldPassword}
                                        type={"password"}
                                        autoComplete="username"
                                        focusBorderColor={"blue.200"}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                    <Input
                                        required
                                        placeholder='New Password'
                                        value={newPassword}
                                        type={"password"}
                                        autoComplete="username"
                                        focusBorderColor={"blue.200"}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <Button
                                        _hover={{
                                            backgroundColor: 'blue.400'
                                        }}
                                        isLoading={loading}
                                        type='submit'
                                        minW={'full'}
                                        onClick={handleSubmit}
                                        variant={'ghost'}
                                        backgroundColor={'blue.300'}
                                        textColor={'white'}
                                    >
                                        Change
                                    </Button>
                                </div>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button mr="3" onClick={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>



            </div >

        </div >
    )
}

export default ChangePassword