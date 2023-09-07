import { Avatar, Button, Input, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { register } from '../../redux/actions/user'

const fileUploadStyle = {
  '&::file-selector-button': {
    cursor: 'pointer',
    marginLeft: '-5%',
    width: '110%',
    border: 'none',
    height: '100%',
    color: '#0000FF',
    backgroundColor: 'white',
  }
}

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [username, setUsername] = useState("");
  const [image, setImage] = useState()
  const [imagePrev, setImagePrev] = useState()
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    //we have to send FormData into the backend.
    const myForm = new FormData();
    myForm.append("name", name);
    myForm.append("username", username);
    myForm.append("email", email);
    myForm.append("password", password);
    myForm.append("file", image);

    
    dispatch(register(myForm));
  }



  //To take avatar as input.
  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    }

  }

  return (
    <div className='gradient1'>
      <div className='flex justify-center flex-row items-center h-screen w-full'>
        <div className='lg:w-[28%] md:w-[50%] w-[90%] pt-5 rounded-lg bg-white '>
          <h1 className='text-[24px] pb-3 uppercase text-center font-[600] text-black'>
            Registration
          </h1>
          <div className='px-12 pb-5' >
            <form onSubmit={submitHandler}>
              <div className='flex flex-col gap-4'>

                <div className='mx-auto'>
                  <Avatar src={imagePrev} size={'xl'} />
                </div>
                <div>
                  <h1 className='pb-[6px] text-[15px] font-[600]'>Name</h1>
                  <Input
                    required
                    id='name'
                    name='name'
                    type='text'
                    placeholder='Enter your name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <h1 className='pb-[6px] text-[15px] font-[600]'>Username</h1>
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
                  <h1 className='pb-[6px] text-[15px] font-[600]'>Email Address</h1>
                  <Input
                    required
                    id='email'
                    name='email'
                    type='email'
                    placeholder='Enter your email address'
                    value={email}

                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <h1 className='pb-[6px] text-[15px] font-[600]'>Password</h1>
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

                <div>
                  <h1 className='pb-[6px] text-[15px] font-[600]'>Choose Avatar</h1>
                  <Input
                    accept='image/*'
                    required
                    id='choose avatar'
                    type='file'
                    css={fileUploadStyle}
                    onChange={changeImageHandler}
                  />
                </div>

                <Button
                  _hover={{
                    backgroundColor: 'blue.400'
                  }}
                  type='submit'
                  textColor={'white'}
                  backgroundColor={'blue.400'}
                  py={5}
                >
                  Register
                </Button>
              </div>
            </form>
            <h1 className='text-[14px] text-start pt-[6px] cursor-pointer font-[600]' >Already a User? {" "}
              <Link to="/login"> <span className='text-blue-400  cursor-pointer hover:underline'>Login {" "}</span> </Link>
              here
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register