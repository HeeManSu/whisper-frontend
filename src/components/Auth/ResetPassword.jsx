import React, { useState } from 'react'
import { Input, Button } from '@chakra-ui/react';


const ResetPassword = () => {

  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div className='flex flex-col justify-center h-screen items-center '>
      <div className='sm:w-[22%] flex w-[82%]'>
        <form onSubmit={handleSubmit} className="">
          <h1 className='text-[26px] text-center uppercase font-[700] text-black pb-4'>Reset Password</h1>
          <Input
            required
            type={'password'}
            placeholder="Enter new password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="username"
          />

          <Button
            _hover={{
              backgroundColor: 'blue.400'
            }}
          
            type='submit'
            textColor={'white'}
            width={'full'}
            backgroundColor={'blue.400'}
            my={5}
          >
            Reset Password
          </Button>
        </form>
      </div>

    </div>
  )
}

export default ResetPassword