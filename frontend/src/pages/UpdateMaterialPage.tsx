import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Menu from '../components/Menu';
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
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
`;

const Label = styled.label`
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

const FileInput = styled.input`
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
  background: #fff;
`;

const Button = styled.button`
  padding: 14px 0;
  width: 100%;
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

const tagsList = [
    'COMPUTER_SCIENCE',
    'LAW',
    'MEDICINE',
    'BIOLOGY',
    'HISTORY',
] as const;
type Tag = typeof tagsList[number];

const formatTag = (t: Tag): string =>
    t
        .split('_')
        .map(w => w[0] + w.slice(1).toLowerCase())
        .join(' ');

interface Material {
    id: string;
    name: string;
    description: string;
    tags: string[];
    type: string;
}

interface JwtPayload {
    id: string;
}

const UpdateMaterialPage: React.FC = () => {
    const { id: materialId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [chosenTags, setChosenTags] = useState<Tag[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [originalType, setOriginalType] = useState<string>('');

    const getUserId = (): string | null => {
        const token = sessionStorage.getItem('token');
        if (!token) return null;
        try {
            return jwtDecode<JwtPayload>(token).id;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        if (!materialId) return;
        fetch(`http://localhost:8080/api/materials/${materialId}`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then((m: Material) => {
                setName(m.name);
                setDescription(m.description);
                setChosenTags(m.tags as Tag[]);
                setOriginalType(m.type);
            })
            .catch(() => {
                alert('Could not load material');
                navigate('/manage-materials');
            });
    }, [materialId, navigate]);

    const onTagsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selections = Array.from(e.target.selectedOptions).map(
            opt => opt.value as Tag
        );
        setChosenTags(selections);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!getUserId()) {
            alert('You must be logged in');
            return;
        }

        const form = new FormData();
        form.append('materialId', materialId!);
        form.append('name', name);
        form.append('description', description);
        chosenTags.forEach(tag => form.append('tags', tag));

        // detect type from new file or use original
        const typeToSend = file
            ? file.name.split('.').pop()?.toUpperCase() || originalType
            : originalType;
        form.append('type', typeToSend);

        if (file) {
            form.append('file', file);
        }

        try {
            const res = await fetch(
                'http://localhost:8080/api/materials/update',
                { method: 'PUT', body: form }
            );
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || res.statusText);
            }
            navigate('/manage-materials');
        } catch (err: any) {
            console.error(err);
            alert('Update failed: ' + err.message);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Header toggleMenu={() => setShowMenu(v => !v)} />
            <Menu open={showMenu} />
            <Container>
                <PageTitle>Update Material</PageTitle>
                <Form onSubmit={handleSubmit}>
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
                        <Label htmlFor="tags">Tags</Label>
                        <TagSelect
                            id="tags"
                            multiple
                            value={chosenTags}
                            onChange={onTagsChange}
                        >
                            {tagsList.map(tag => (
                                <option key={tag} value={tag}>
                                    {formatTag(tag)}
                                </option>
                            ))}
                        </TagSelect>
                    </div>

                    <div style={{ width: '100%' }}>
                        <Label htmlFor="file">Replace File</Label>
                        <FileInput
                            id="file"
                            type="file"
                            accept=".pdf,.docx,.png,.jpg"
                            onChange={onFileChange}
                        />
                    </div>

                    <Button type="submit">Update Material</Button>
                </Form>
            </Container>
        </>
    );
};

export default UpdateMaterialPage;
