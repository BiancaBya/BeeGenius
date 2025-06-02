// src/pages/AddMaterialPage.tsx
import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {toast} from "react-toastify";

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
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    max-width: 400px;
`;

const Label = styled.label`
    align-self: flex-start;
    font-weight: 600;
    margin-bottom: 6px;
`;

const Input = styled.input`
    padding: 12px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    width: 100%;
    box-sizing: border-box;
`;

const Textarea = styled.textarea`
    padding: 12px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    resize: vertical;
    width: 100%;
    box-sizing: border-box;
`;

const TagSelect = styled.select`
    padding: 12px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    width: 100%;
    box-sizing: border-box;
    min-height: 120px;
    background-color: #fff;
`;

const Button = styled.button`
    padding: 14px 0;
    width: 100%;
    max-width: 400px;
    font-size: 1.1rem;
    font-weight: 600;
    background: #ffc107;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #e6b800;
    }
`;

interface JwtPayload {
    id: string;
}

const AddMaterialPage: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [chosenTags, setChosenTags] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const getUserId = (): string | null => {
        const token = sessionStorage.getItem('token');
        if (!token) return null;
        try {
            const { id } = jwtDecode<JwtPayload>(token);
            return id;
        } catch {
            return null;
        }
    };

    const fetchTags = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/tags`, {
                method:"GET",
                headers:{
                    "Authorization": `Bearer ${token}`,
                }});
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

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    };

    const onTagsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selections = Array.from(e.target.selectedOptions, opt => opt.value);
        setChosenTags(selections);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userId = getUserId();
        if (!userId) {
            alert('You must be logged in');
            return;
        }
        if (!name || !description || !file || chosenTags.length === 0) {
            toast.error('Please fill in all fields and pick at least one tag.');
            return;
        }

        const ext = file.name.split('.').pop()?.toUpperCase() || '';
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('type', ext);
        chosenTags.forEach(tag => formData.append('tags', tag));
        formData.append('file', file);
        formData.append('userId', userId);

        try {
            const res = await fetch(`${BASE_URL}/api/materials`, {
                method: 'POST',
                body: formData,
                headers:{
                    "Authorization": `Bearer ${token}`,
                }
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || res.statusText);
            }
            navigate('/materials');
        } catch (err: any) {
            console.error(err);
            toast.error(err);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Header toggleMenu={() => setShowMenu(v => !v)} />
            <Menu open={showMenu} />
            <Container>
                <PageTitle>Add New Material</PageTitle>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div style={{ width: '100%' }}>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div style={{ width: '100%' }}>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div style={{ width: '100%' }}>
                        <Label htmlFor="file">File</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".pdf,.docx,.png,.jpg"
                            onChange={onFileChange}
                        />
                    </div>

                    <div style={{ width: '100%' }}>
                        <Label htmlFor="tags">Tags</Label>
                        <TagSelect
                            id="tags"
                            multiple
                            value={chosenTags}
                            onChange={onTagsChange}
                        >
                            {availableTags.map(tag => (
                                <option key={tag} value={tag}>
                                    {tag.replace('_', ' ')}
                                </option>
                            ))}
                        </TagSelect>
                    </div>

                    <Button type="submit">Upload Material</Button>
                </Form>
            </Container>
        </>
    );
};

export default AddMaterialPage;
