import React, { useState, useEffect } from 'react';
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
    height: 120px;
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
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [showMenu, setShowMenu] = useState(false);

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const from = (location.state as { from?: string })?.from || '/books';

    const getUserId = (): string | null => {
        try {
            const raw = sessionStorage.getItem('token');
            if (!raw) return null;
            const decoded = jwtDecode<JwtPayload>(raw);
            return decoded.id;
        } catch {
            return null;
        }
    };

    const fetchTags = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/api/tags`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to load tags');
            const tags: string[] = await res.json();
            setAvailableTags(tags);
        } catch (err) {
            console.error('Error fetching tags:', err);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const values = Array.from(e.target.selectedOptions, opt => opt.value);
        setSelectedTags(values);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Must be logged in
        const token = sessionStorage.getItem('token');
        if (!token) {
            toast.error('You must be logged in.');
            return;
        }

        let userId = '';
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            userId = decoded.id;
        } catch {
            toast.error('Invalid token.');
            return;
        }

        if (!title.trim() || !author.trim() || selectedTags.length === 0 || !image) {
            toast.error('Please fill all fields and select at least one tag.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('userId', userId);
        selectedTags.forEach(tag => formData.append('tags', tag));
        formData.append('imageFile', image);

        try {
            const res = await fetch(`${BASE_URL}/api/books`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (res.ok) {
                toast.success('Book added successfully!');
                setTimeout(() => navigate(from), 1500);
            } else {
                const errorText = await res.text();
                toast.error('Failed to add book: ' + errorText);
            }
        } catch (err) {
            console.error('Error submitting book:', err);
            toast.error('Error submitting book.');
        }
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
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                        <Input
                            type="text"
                            placeholder="Author"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            required
                        />

                        <Select
                            multiple
                            value={selectedTags}
                            onChange={handleTagChange}
                            required
                        >
                            <option value="">-- Select Tags --</option>
                            {availableTags.map(tag => (
                                <option key={tag} value={tag}>
                                    {tag.replace('_', ' ')}
                                </option>
                            ))}
                        </Select>

                        <Input
                            type="file"
                            accept="image/*"
                            onChange={e => setImage(e.target.files?.[0] || null)}
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
