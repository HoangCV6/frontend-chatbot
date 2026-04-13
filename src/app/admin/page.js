"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
// Thêm vào đầu hàm AdminDashboard
const [pass, setPass] = useState("");
const ADMIN_PASSWORD = "admin123"; // Thay bằng mật khẩu của bạn

if (pass !== ADMIN_PASSWORD) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="p-8 bg-gray-800 rounded-lg shadow-2xl">
        <h1 className="text-xl font-bold mb-4">Xác thực Admin Toshiko</h1>
        <input 
          type="password" 
          className="text-black p-2 rounded w-full mb-4" 
          placeholder="Nhập mã bảo mật..."
          onChange={(e) => setPass(e.target.value)}
        />
      </div>
    </div>
  );
}
  useEffect(() => {
    // Gọi API lấy danh sách user từ Backend Render của bạn
    const fetchUsers = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  const loadChat = async (userId) => {
    // Giả sử mỗi user có 1 session, lấy session đầu tiên
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/session/${userId}`);
    setMessages(res.data);
    setSelectedSession(userId);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      {/* Cột trái: Danh sách khách */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b font-bold text-lg text-blue-600">Khách hàng Toshiko</div>
        <div className="flex-1 overflow-y-auto">
          {users.map((u) => (
            <div 
              key={u.id} 
              onClick={() => loadChat(u.id)}
              className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition ${selectedSession === u.id ? 'bg-blue-100' : ''}`}
            >
              <p className="font-semibold">{u.username || "Ẩn danh"}</p>
              <p className="text-xs text-gray-500">{u.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cột phải: Nội dung chi tiết */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <div className="flex flex-col h-full">
            <div className="p-4 bg-white border-b font-medium shadow-sm">Lịch sử tư vấn</div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-3 rounded-lg max-w-md ${m.role === 'user' ? 'bg-gray-200' : 'bg-blue-100 text-blue-800'}`}>
                    <p className="text-[10px] uppercase font-bold opacity-50 mb-1">{m.role}</p>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">Chọn một khách hàng bên trái để xem nội dung tư vấn</div>
        )}
      </div>
    </div>
  );
}