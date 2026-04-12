"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ChatApp() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 1. Hàm Đăng nhập/Đăng ký
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login?username=${name}&phone=${phone}`);
      setUser(res.data);
    } catch (err) {
      alert("Lỗi đăng nhập!");
    }
  };

  // 2. Hàm gửi tin nhắn
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input) return;

    const userMsg = { role: "user", content: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat/send`, {
        user_id: user.user_id,
        content: input
      });
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      alert("Lỗi khi gửi tin nhắn!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form onSubmit={handleLogin} className="p-8 bg-white shadow-xl rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Toshiko AI Chat</h2>
          <input className="w-full p-2 mb-2 border rounded" placeholder="Họ tên" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="w-full p-2 mb-4 border rounded" placeholder="Số điện thoại" value={phone} onChange={e=>setPhone(e.target.value)} required />
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Bắt đầu</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg shadow-inner mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border text-gray-800'}`}>
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-400 italic">Bot đang trả lời...</div>}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input className="flex-1 border p-2 rounded shadow-sm focus:outline-blue-500 text-black" value={input} onChange={e=>setInput(e.target.value)} placeholder="Nhập tin nhắn..." />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Gửi</button>
      </form>
    </div>
  );
}