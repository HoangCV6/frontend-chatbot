"use client";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

export default function ChatApp() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login?username=${name}&phone=${phone}`);
      setUser(res.data); // Lưu thông tin user bao gồm user_id
    } catch (err) {
      alert("Không thể kết nối Backend. Hãy kiểm tra URL Render!");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input || !user) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat/send`, {
        user_id: user.user_id,
        content: input
      });
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      alert("Lỗi kết nối chatbot!");
    } finally {
      setLoading(false);
    }
  };

  // MÀN HÌNH ĐĂNG NHẬP
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f0f2f5]">
        <form onSubmit={handleLogin} className="p-8 bg-white shadow-2xl rounded-3xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-blue-700">TOSHIKO AI</h2>
            <p className="text-gray-500 mt-2">Vui lòng nhập thông tin để bắt đầu tư vấn</p>
          </div>
          <input className="w-full p-4 mb-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                 placeholder="Họ và tên của bạn" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="w-full p-4 mb-6 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                 placeholder="Số điện thoại" value={phone} onChange={e=>setPhone(e.target.value)} required />
          <button className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg">Bắt đầu trò chuyện</button>
        </form>
      </div>
    );
  }

  // MÀN HÌNH CHAT PHONG CÁCH GEMINI
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center shadow-sm">
        <span className="font-bold text-xl text-blue-600">Toshiko T90 Advisor</span>
        <div className="text-sm text-gray-500 italic">Chào, {user.username}</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] shadow-sm ${
              m.role === 'user' 
              ? 'bg-[#004aad] text-white rounded-tr-none' 
              : 'bg-[#f0f4f9] text-gray-800 rounded-tl-none'
            }`}>
              <ReactMarkdown className="prose prose-sm max-w-none">{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="text-blue-400 animate-pulse ml-4">Đang xử lý...</div>}
      </div>

      {/* Input */}
      <div className="p-4 md:pb-10 bg-white">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto relative group">
          <input 
            className="w-full p-5 pr-14 rounded-full bg-[#f0f4f9] border-none focus:ring-2 focus:ring-blue-200 outline-none text-black text-lg shadow-inner"
            placeholder="Đặt câu hỏi về ghế T90..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="absolute right-3 top-2.5 p-3 bg-blue-600 text-white rounded-full hover:scale-110 transition-transform shadow-md">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
}