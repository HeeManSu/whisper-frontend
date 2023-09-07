import React, { useState } from 'react'
import { Input, Button } from '@chakra-ui/react';

const ForgetPassword = () => {

  const [email, setEmail] = useState("");

  return (
    <div className='h-screen w-full flex-col flex items-center justify-center'>

      <div className='lg:w-[22%] flex flex-col  md:w-[50%] w-[90%]'>
        <h1 className='text-[24px]  pb-4 font-[700] text-center uppercase'>forget password</h1>
        <Input
          required
          id='email'
          name='email'
          type='email'
          placeholder='Enter your email address'
          value={email}

          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
        mt={4}
          _hover={{
            backgroundColor: 'blue.400'
          }}
          type='submit'
          textColor={'white'}
          backgroundColor={'blue.400'}
          py={5}
        >
          Send reset link
        </Button>
      </div>

    </div>
  )
}

export default ForgetPassword