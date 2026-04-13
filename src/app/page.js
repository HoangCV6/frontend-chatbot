"use client";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/send`, {
        user_id: 1, // Tạm thời để fix
        content: input
      });
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f9f9f9] font-sans">
      {/* Header */}
      <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-blue-700">TOSHIKO AI Assistant</h1>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">T</div>
      </div>

      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 && (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-medium text-gray-300">Tôi có thể giúp gì cho bạn?</h2>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              m.role === 'user' 
              ? 'bg-[#e3efff] text-[#084298] rounded-tr-none' 
              : 'bg-white shadow-sm border border-gray-100 rounded-tl-none text-gray-800'
            }`}>
              <ReactMarkdown className="prose prose-sm">{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm animate-pulse">Toshiko đang trả lời...</div>}
      </div>

      {/* Input Area - Kiểu Gemini */}
      <div className="p-4 bg-white">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto relative flex items-center">
          <input 
            className="w-full p-4 pr-12 rounded-full border border-gray-200 focus:outline-none focus:border-blue-400 shadow-sm text-black"
            placeholder="Hỏi Toshiko về ghế T90..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="absolute right-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
        <p className="text-[10px] text-center text-gray-400 mt-2">AI có thể đưa ra câu trả lời nhầm lẫn, hãy kiểm tra lại thông tin quan trọng.</p>
      </div>
    </div>
  );
}