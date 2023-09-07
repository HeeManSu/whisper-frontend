import { Button, Input } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { login } from '../../redux/actions/user'


const Login = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(username, password));
    }

    

    return (
        <div className='gradient1'>
            <div className='flex justify-center flex-row items-center h-screen w-full'>
                <div className='lg:w-[28%] md:w-[50%] w-[90%] pt-7 rounded-lg bg-white '>
                    <h1 className='text-[24px] pb-9 text-center font-[600] text-black'>
                        Welcome to Whisper
                    </h1>
                    <div className='px-12 pb-12' >
                        <form onSubmit={submitHandler}>
                            <div className='flex flex-col gap-5'>
                                <div>
                                    <h1 className='pb-2 text-[15px] font-[600]'>Username</h1>
                                    <Input
                                        required
                                        id='username'
                                        name='username'
                                        type='text'
                                        placeholder='Enter your username'
                                        value={username}

                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <h1 className='pb-2 text-[15px] font-[600]'>Password</h1>
                                    <Input
                                        required
                                        id='password'
                                        name='password'
                                        type='password'
                                        placeholder='Enter your password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="username"
                                    />
                                </div>
                                <Link to="/forgetpassword">
                                    <h1 className='text-[14px] cursor-pointer font-[600]'>Forget Password?</h1>
                                </Link>
                                <Button
                                    _hover={{
                                        backgroundColor: 'blue.400'
                                    }}
                                    type='submit'
                                    textColor={'white'}
                                    backgroundColor={'blue.400'}
                                    py={5}
                                >
                                    Login
                                </Button>
                            </div>
                        </form>
                        <h1 className='text-[14px] text-start pt-4 cursor-pointer font-[600]' >Don't have account? {" "}
                            <Link to="/register"> <span className='text-blue-400  cursor-pointer hover:underline'>Register {" "}</span> </Link>
                       
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login