import { useState } from 'react'
import api from '../api'

export default function ChatBox() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return
    setLoading(true)
    try {
      const res = await api.post('/chat/', { message })
      setResponse(res.data.response)
    } catch (error) {
      setResponse('Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type your message"
        disabled={loading}
      />
      <button onClick={sendMessage} disabled={loading}>Send</button>
      {loading && <p>Loading...</p>}
      <p>Response: {response}</p>
    </div>
  )
}