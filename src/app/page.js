// Cài đặt thêm nếu chưa có: npm install react-markdown
import ReactMarkdown from 'react-markdown';

// ... trong phần return
<div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#fdfdfd] space-y-6">
  {messages.map((m, i) => (
    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
        {/* Tên hiển thị nhỏ */}
        <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 px-2">
          {m.role === 'user' ? 'Bạn' : 'Trợ lý Toshiko'}
        </span>
        
        {/* Bong bóng chat */}
        <div className={`p-4 rounded-2xl shadow-sm leading-relaxed ${
          m.role === 'user' 
          ? 'bg-[#1a73e8] text-white rounded-tr-none' 
          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
        }`}>
          <ReactMarkdown className="prose prose-sm max-w-none break-words">
            {m.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  ))}
  {loading && (
    <div className="flex space-x-2 p-2">
      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    </div>
  )}
</div>