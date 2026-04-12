import { useState } from 'react'
import axios from 'axios'
import ChatBox from '../components/ChatBox'

export default function Home() {
  return (
    <div>
      <h1>My Chatbot</h1>
      <ChatBox />
    </div>
  )
}