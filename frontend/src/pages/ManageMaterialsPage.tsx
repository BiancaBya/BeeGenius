import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from '../components/Header';
import Menu from '../components/Menu';
import ConfirmModal from '../components/ConfirmModal';
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
  padding: 110px 40px;
  max-width: 960px;
  margin: 0 auto;
`;

const PageTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 1.25rem;
`;

const Desc = styled.p`
  flex: 1;
  color: #444;
  margin: 0 0 12px;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
`;

const Tag = styled.span<{ color: string }>`
  background: ${p => p.color};
  color: #fff;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 0.85rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'delete' | 'update' }>`
  padding: 6px 12px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  ${p =>
    p.variant === 'delete'
        ? `
    background: #e74c3c;
    color: #fff;
    &:hover { background: #c0392b; }
  `
        : `
    background: #3498db;
    color: #fff;
    &:hover { background: #2980b9; }
  `}
`;

// Colors for each tag enum
const tagColors: Record<string,string> = {
    LAW: '#f48c06',
    COMPUTER_SCIENCE: '#4ea8de',
    MEDICINE: '#3e8e41',
    BIOLOGY: '#8e44ad',
    HISTORY: '#c2112b',
};

interface Material {
    id: string;
    name: string;
    description?: string;
    tags?: string[];
    user: { id: string };
}

interface JwtPayload { id: string; }

const ManageMaterialsPage: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [toDelete, setToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

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
        const uid = getUserId();
        if (!uid) {
            alert('You must be logged in');
            return;
        }

        fetch('http://localhost:8080/api/materials')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then((all: Material[]) => {
                setMaterials(all.filter(m => m.user?.id === uid));
            })
            .catch(err => console.error('Error fetching materials:', err));
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:8080/api/materials/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error(await res.text());
            setMaterials(ms => ms.filter(m => m.id !== id));
        } catch (err: any) {
            console.error('Delete error:', err);
            alert('Delete failed: ' + err.message);
        } finally {
            setToDelete(null);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Header toggleMenu={() => setShowMenu(v => !v)} />
            <Menu open={showMenu} />

            <Container>
                <PageTitle>Manage My Materials</PageTitle>

                <Grid>
                    {materials.map(mat => (
                        <Card key={mat.id}>
                            <div>
                                <Title>{mat.name}</Title>
                                <Desc>{mat.description}</Desc>
                                <TagList>
                                    {mat.tags?.map(tag => (
                                        <Tag key={tag} color={tagColors[tag] || '#777'}>
                                            {tag.replace('_', ' ')}
                                        </Tag>
                                    ))}
                                </TagList>
                            </div>
                            <ButtonRow>
                                <Button
                                    variant="update"
                                    onClick={() => navigate(`/update-material/${mat.id}`)}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="delete"
                                    onClick={() => setToDelete(mat.id)}
                                >
                                    Delete
                                </Button>
                            </ButtonRow>
                        </Card>
                    ))}
                </Grid>
            </Container>

            {toDelete && (
                <ConfirmModal
                    isOpen={true}
                    message="Are you sure you want to delete this material?"
                    onCancel={() => setToDelete(null)}
                    onConfirm={() => handleDelete(toDelete)}
                />
            )}
        </>
    );
};

export default ManageMaterialsPage;
