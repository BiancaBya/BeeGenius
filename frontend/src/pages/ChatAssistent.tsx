import React, { useState, FormEvent } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');

    body {
        margin: 0;
        padding: 0;
        font-family: 'Josefin Sans', sans-serif;
        background-color: #fcf6e8;
    }
`;

const Container = styled.div`
    padding: 110px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PageTitle = styled.h2`
    font-size: 2.25rem;
    font-weight: 600;
    margin-bottom: 30px;
    text-align: center;
    color: #333;
`;

const ChatBox = styled.div`
    width: 100%;
    max-width: 600px;
    height: 400px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    overflow-y: auto;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const MessageList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const MessageItem = styled.div<{ role: 'user' | 'assistant' }>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 80%;
    align-self: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};

    background-color: ${({ role }) =>
            role === 'user' ? '#dcf8c6' : '#f1f0f0'};
    color: #333;
    padding: 10px 14px;
    border-radius: 8px;
    word-wrap: break-word;

    & > span {
        font-size: 0.9rem;
        margin-bottom: 4px;
        color: #555;
    }

    & > p {
        margin: 0;
        font-size: 1rem;
        line-height: 1.4;
    }
`;

const InputContainer = styled.form`
    display: flex;
    margin-top: 20px;
    width: 100%;
    max-width: 600px;
`;

const InputField = styled.input`
    flex-grow: 1;
    padding: 12px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    box-sizing: border-box;
`;

const SendButton = styled.button`
    margin-left: 10px;
    padding: 0 24px;
    font-size: 1rem;
    font-weight: 600;
    background: #ffc107;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    color: #333;

    &:hover {
        background: #e6b800;
    }

    &:disabled {
        background: #ffd966;
        cursor: not-allowed;
    }
`;

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface JwtPayload {
    id: string;
}

const ChatAssistant: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi there! I\'m Honey 🍯, your buzzing little helper. What can I do for you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const getUserId = (): string | null => {
        const tokenInStorage = sessionStorage.getItem('token');
        if (!tokenInStorage) return null;
        try {
            const { id } = jwtDecode<JwtPayload>(tokenInStorage);
            return id;
        } catch {
            return null;
        }
    };

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userId = getUserId();
        if (!userId) {
            alert('You must be logged in to chat.');
            navigate('/login');
            return;
        }

        const newMessage: Message = { role: 'user', content: input };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || response.statusText);
            }

            const data = await response.json();
            setMessages([
                ...updatedMessages,
                { role: 'assistant', content: data.reply },
            ]);
        } catch (err: any) {
            console.error('Error sending message:', err);
            setMessages([
                ...updatedMessages,
                { role: 'assistant', content: 'Error: Could not reach AI service.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Header toggleMenu={() => setShowMenu((v) => !v)} />
            <Menu open={showMenu} />
            <Container>
                <PageTitle>Chat with Honey 🐝</PageTitle>
                <ChatBox>
                    <MessageList>
                        {messages.map((msg, idx) => (
                            <MessageItem key={idx} role={msg.role}>
                <span>
                  {msg.role === 'user' ? 'You' : 'AI'}:
                </span>
                                <p>{msg.content}</p>
                            </MessageItem>
                        ))}
                        {loading && (
                            <MessageItem role="assistant">
                                <span>AI:</span>
                                <p>Typing...</p>
                            </MessageItem>
                        )}
                    </MessageList>
                </ChatBox>
                <InputContainer onSubmit={sendMessage}>
                    <InputField
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question..."
                        disabled={loading}
                    />
                    <SendButton type="submit" disabled={loading}>
                        Send
                    </SendButton>
                </InputContainer>
            </Container>
        </>
    );
};

export default ChatAssistant;

