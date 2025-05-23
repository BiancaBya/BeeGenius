import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/Header';
import Menu from '../components/Menu';

interface JwtPayload {
    id: string;
}

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        font-family: 'Josefin Sans', sans-serif;
        background-color: #fcf6e8;
    }
`;

const PageWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    padding: 140px 40px 40px 40px;
`;

const Title = styled.h2`
    font-size: 2rem;
    margin: 0 auto 30px auto;
    border-bottom: 2px solid #000;
    width: fit-content;
    text-align: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 500px;
    margin: auto;
    gap: 16px;
`;

const Input = styled.input`
    padding: 10px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
`;

const Select = styled.select`
    padding: 10px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
`;

const Button = styled.button`
    padding: 12px;
    font-size: 1rem;
    border: none;
    background-color: #ffc107;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        background-color: #e6b800;
    }
`;

const AddBookPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [showMenu, setShowMenu] = useState(false);

    const from = (location.state as { from?: string })?.from || '/books';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = sessionStorage.getItem('token');
        if (!token) {
            toast.error('You must be logged in.');
            return;
        }

        let userId = '';
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            userId = decoded.id;
        } catch (err) {
            toast.error('Invalid token.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('userId', userId);
        tags.forEach(tag => formData.append('tags', tag));
        if (image) formData.append('imageFile', image);

        try {
            const res = await fetch('http://localhost:8080/api/books', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                toast.success('Book added successfully!');
                setTimeout(() => navigate(from), 1500);
            } else {
                const errorText = await res.text();
                toast.error('Failed to add book: ' + errorText);
            }
        } catch (err) {
            toast.error('Error submitting book.');
        }
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setTags(value);
    };

    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                <Header toggleMenu={() => setShowMenu(!showMenu)} />
                <Menu open={showMenu} />
                <Container>
                    <ToastContainer />
                    <Title>Add a New Book</Title>
                    <Form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <Input
                            type="text"
                            placeholder="Author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                        <Select multiple value={tags} onChange={handleTagChange} required>
                            <option value="LAW">Law</option>
                            <option value="COMPUTER_SCIENCE">Computer Science</option>
                            <option value="MEDICINE">Medicine</option>
                            <option value="BIOLOGY">Biology</option>
                            <option value="HISTORY">History</option>
                        </Select>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                            required
                        />
                        <Button type="submit">Add Book</Button>
                    </Form>
                </Container>
            </PageWrapper>
        </>
    );
};

export default AddBookPage;
