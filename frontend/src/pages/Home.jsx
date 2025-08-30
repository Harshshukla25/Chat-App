import React from 'react'
import SideBar from '../component/SideBar'
import MessageArea from '../component/MessageArea'
import { useSelector } from 'react-redux'
import getMessage from '../customHooks/getMessages'

const Home = () => {
  const {selectedUser}=useSelector(state=>state.user)
  getMessage
  return (
    <div className='w-full h-[100vh] flex overflow-hidden'>
      <SideBar/>
      <MessageArea/>
    </div>
  )
}

export default Home
