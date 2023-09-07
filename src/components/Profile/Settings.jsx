import React from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Container, VStack, Input, useDisclosure } from "@chakra-ui/react";
import { Avatar, Button } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, updateProfile, updateProfilePicture } from '../../redux/actions/user';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { useState } from 'react';
import { changePassword } from '../../redux/actions/user';

const Settings = ({ isSettingOpen, SettingClose, currentUser }) => {
    const [isChangePhotoBoxOpen, setIsChangePhotoBoxOpen] = useState(false); // New state variable
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);

    // console.log(currentUser)

    const { isOpen, onClose, onOpen } = useDisclosure();
    const dispatch = useDispatch();
    const { loading, message, error } = useSelector(state => state.user)

    const changeImageSubmitHandler = async (e, image) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.append('file', image);
        await dispatch(updateProfilePicture(myForm));
        dispatch(loadUser());
    }
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
        <div>
            <Modal size={'sm'} isOpen={isSettingOpen} onClose={SettingClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Settings</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className='flex items-center flex-col gap-5 mt-[40px]'>
                            <Avatar src={currentUser?.avatar?.url} size={'xl'} />
                            <Button
                                _hover={{
                                    backgroundColor: "blue.400"
                                }}
                                isLoading={loading}

                                variant={'ghost'}
                                bgColor="blue.300"
                                onClick={() => setIsChangePhotoBoxOpen(true)}
                                textColor={'white'}
                            >
                                Change Photo
                            </Button>
                            <Button
                                _hover={{
                                    backgroundColor: "blue.400"
                                }}
                                isLoading={loading}
                                onClick={() => setIsChangeEmailOpen(true)} // Open Change Password
                                variant={'ghost'}
                                bgColor="blue.300"
                                textColor={'white'}
                            >
                                Change Email
                            </Button>
                            <Button
                                _hover={{
                                    backgroundColor: "blue.400"
                                }}
                                isLoading={loading}
                                onClick={() => setIsChangePasswordOpen(true)} // Open Change Password
                                variant={'ghost'}
                                bgColor="blue.300"
                                textColor={'white'}
                            >
                                Change Password
                            </Button>

                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={SettingClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {isChangePhotoBoxOpen && (
                <ChangePhotoBox
                    isOpen={isChangePhotoBoxOpen}
                    onClose={() => setIsChangePhotoBoxOpen(false)} // Close Change Photo Box
                    changeImageSubmitHandler={changeImageSubmitHandler}
                    loading={loading}
                />
            )}
            {isChangePasswordOpen && (
                <ChangePassword
                    isOpen={isChangePasswordOpen}
                    onClose={() => setIsChangePasswordOpen(false)} // Close Change Password
                    loading={loading}
                />
            )}
            {isChangeEmailOpen && (
                <ChangeEmail
                    isOpen={isChangeEmailOpen}
                    onClose={() => setIsChangeEmailOpen(false)} // Close Change Password
                    loading={loading}
                />
            )}
        </div >
    )
}

export default Settings



const ChangePhotoBox = ({ isOpen,
    onClose,
    changeImageSubmitHandler, loading }) => {

    const [image, setImage] = useState('');
    const [imagePrev, setImagePrev] = useState('');

    const changeImage = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setImagePrev(reader.result);
            setImage(file);
        };
    };

    const closeHandler = () => {
        onClose();
        setImagePrev('');
        setImage('');
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter={'blur(10px)'} />
            <ModalContent>
                <ModalHeader>Change Photo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Container>
                        <form onSubmit={e => changeImageSubmitHandler(e, image)}>
                            <VStack spacing={'8'}>
                                {imagePrev && <Avatar src={imagePrev} boxSize={'48'} />}

                                <Input
                                    type={'file'}

                                    onChange={changeImage}
                                />

                                <Button
                                    w="full"
                                    colorScheme={'blue'}
                                    type="submit"
                                    isLoading={loading}
                                >
                                    Change
                                </Button>
                            </VStack>
                        </form>
                    </Container>
                </ModalBody>

                <ModalFooter>
                    <Button mr="3" onClick={closeHandler}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}


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
        toast.success("Password changes successfully")

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
                    <ModalOverlay backdropFilter={'blur(5px)'} />
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

const ChangeEmail = ({ isOpen,
    onClose,
}) => {

    const [currentUser, setCurrentUser] = useState();

    const [email, setEmail] = useState(currentUser?.email);

    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(updateProfile(email))
        dispatch(loadUser());
    }

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem("userInfo")));
    }, []);

    const { loading } = useSelector(state => state.user)


    return (
        <div className='flex flex-col justify-center h-screen items-center '>
            <div className='sm:w-[22%] w-[82%]'>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay backdropFilter={'blur(5px)'} />
                    <ModalContent>
                        <ModalHeader></ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <h1 className='text-[24px] uppercase text-center  font-[700] text-black pb-4'>Update Email</h1>
                            <form onSubmit={handleSubmit}>
                                <div className='flex gap-4 flex-col  '>
                     
                                    <Input
                                        required
                                        placeholder='New Email'
                                        value={email}
                                        type={"email"}
                                        focusBorderColor={"blue.200"}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Button
                                        _hover={{
                                            backgroundColor: "blue.400"
                                        }}
                                        type='submit'
                                        minW={'full'}
                                        isLoading={loading}
                                        variant={'ghost'}
                                        backgroundColor={'blue.300'}
                                        textColor={'white'}
                                    >
                                        Update
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

