import React, { useState } from 'react'
import { Input, Button } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../../redux/actions/user';
import { updateProfile } from '../../redux/actions/user';



const UpdateProfile = ({ user }) => {
    const [email, setEmail] = useState(user.email);

    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(updateProfile( email))
        dispatch(loadUser());
      
    }

    const { loading } = useSelector(state => state.user)

    return (
        <div className='flex flex-col justify-center h-screen items-center '>
            <div className='sm:w-[22%] w-[82%]'>

                <h1 className='text-[24px] uppercase text-center  font-[700] text-black pb-4'>Update Profile</h1>
                <form onSubmit={handleSubmit}>
                    <div className='flex gap-4 flex-col  '>
                        <Input
                            required
                            placeholder='New Name'
                            value={name}
                            type={"text"}
                            focusBorderColor={"blue.200"}
                            onChange={(e) => setName(e.target.value)}
                        />
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
                            backgroundColor={'orange.300'}
                            textColor={'white'}
                        >
                            Update
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateProfile




{/* <Popover>
  
Trigger
  </PopoverTrigger>
  <PopoverContent>
    <PopoverArrow />
    <PopoverCloseButton />
    <PopoverHeader>Confirmation!</PopoverHeader>
    <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
  </PopoverContent>
</Popover> */}