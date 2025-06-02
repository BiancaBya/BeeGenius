import React, { useState } from 'react';

const ChatAssistant: React.FC = () => {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState('');
    const token = sessionStorage.getItem('token');

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);

        const res = await fetch('http://localhost:8080/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,
                        Authorization : `Bearer ${token}`},
            body: JSON.stringify({ messages: updatedMessages }),
        });

        const data = await res.json();
        setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
        setInput('');
    };

    return (
        <div style={{ padding: '100px 40px' }}>
            <h2>Ask the AI Assistant 🤖</h2>
            <div style={{ margin: '20px 0' }}>
                {messages.map((msg, i) => (
                    <p key={i}><strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}</p>
                ))}
            </div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask something..."
                style={{ padding: 10, width: 400 }}
            />
            <button onClick={sendMessage} style={{ marginLeft: 10, padding: 10 }}>Send</button>
        </div>
    );
};

export default ChatAssistant;
