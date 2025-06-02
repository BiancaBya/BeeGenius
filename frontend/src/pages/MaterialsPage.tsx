import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from '../components/Header';
import Menu from '../components/Menu';
import pdfIcon from '../assets/pdf.png';
import docxIcon from '../assets/docx.png';
import pngIcon from '../assets/png.png';
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from 'react-icons/ti';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getTagColor } from '../utils/tagColorGenerator';

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
`;

const MaterialCard = styled.div`
  background: #d5d0c4;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
`;

const FileIcon = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MaterialTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
`;

const Description = styled.div`
  margin: 8px 0;
  font-size: 0.95rem;
  color: #222;
  line-height: 1.4;
`;

const InfoRow = styled.div`
  display: flex;
  align-self: end;
  gap: 10px;
  flex-wrap: wrap;
`;

const Tag = styled.span<{ color: string }>`
  background: ${props => props.color};
  color: #fff;
  border-radius: 15px;
  padding: 4px 12px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const Stars = styled.div`
  display: flex;
  font-size: 1.8rem;
  color: #ffc107;
`;

const Posted = styled.div`
  font-size: 0.9rem;
  margin-top: 12px;
  align-self: flex-end;
`;

const UserBadge = styled.span`
  background: #4c7ea1;
  color: #fff;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-left: 6px;
`;

const PostedAndTags = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 80px;
  font-size: 0.9rem;
  margin-top: 0;
  align-self: flex-end;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 0;
  white-space: nowrap;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 10px;
  background-color: white;
  border: 1px solid #ccc;
  flex: 1;
  max-width: 500px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
  margin-left: 8px;
  width: 100%;
`;

const TagFilter = styled.select`
  padding: 10px;
  font-size: 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='0,0 14,0 7,7' fill='%23666'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 10px;
`;

const Underline = styled.div`
  height: 2px;
  width: 100%;
  background-color: black;
  margin: 10px 0 30px;
`;


const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const empty = 5 - full - (half ? 1 : 0);
    const Icon_Full = TiStarFullOutline as React.ElementType;
    const Icon_Half = TiStarHalfOutline as React.ElementType;
    const Icon_None = TiStarOutline as React.ElementType;

    return (
        <>
            {Array(full)
                .fill(0)
                .map((_, i) => (
                    <Icon_Full key={i} />
                ))}
            {half && <Icon_Half key="half" />}
            {Array(empty)
                .fill(0)
                .map((_, i) => (
                    <Icon_None key={i} />
                ))}
        </>
    );
};

const FloatingButton = styled.button<{ open: boolean }>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #ffc107;
  color: black;
  border: none;
  padding: 15px 25px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: ${props => props.open ? 999 : 1000}; 
    transition: all 0.2s ease;

  &:hover {
    background-color: #e6b800;
  }
`;

export interface JwtPayload {
    id: string;
}

export const MaterialsPage: React.FC = () => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [materials, setMaterials] = useState<any[]>([]);
    const [search, setSearch] = useState<string>('');
    const [selectedTag, setSelectedTag] = useState<string>('');
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const token = sessionStorage.getItem("token");
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const getUserId = () => {
        const token = sessionStorage.getItem('token');
        if (!token) return null;
        try {
            return jwtDecode<JwtPayload>(token).id;
        } catch {
            return null;
        }
    };

    const getSessionUser = () => {
        const id = getUserId();
        if (!id) return;

        fetch(`${BASE_URL}/api/users/${id}`, {
            method:"GET",
            headers:{
                "Authorization": `Bearer ${token}`,
            }})
            .then(res => {
                if (!res.ok) {
                    throw new Error('User not found');
                }
                return res.json();
            })
            .then(data => setUser(data))
            .catch(err => console.error('Error fetching user:', err));
    };

    const fetchMaterials = () => {
        fetch(`${BASE_URL}/api/tags`, {
            method:"GET",
            headers:{
                "Authorization": `Bearer ${token}`,
            }})
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => setMaterials(data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchMaterials();

        fetch(`${BASE_URL}/api/tags`, {
            method:"GET",
            headers:{
                "Authorization": `Bearer ${token}`,
            }})
            .then(res => {
                if (!res.ok) throw new Error('Failed to load tags');
                return res.json();
            })
            .then((data: string[]) => setAvailableTags(data))
            .catch(err => console.error('Error loading tags:', err));

        getSessionUser();
    }, []);

    const filtered = materials.filter(
        m =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            (m.description?.toLowerCase() || '').includes(search.toLowerCase())
    );

    const handleFilter = (tag: string) => {
        if (!tag) {
            fetchMaterials();
            return;
        }
        fetch(`${BASE_URL}/api/materials/filter?tag=${tag}`, {
            method:"GET",
            headers:{
                "Authorization": `Bearer ${token}`,
            }})
            .then(res => res.json())
            .then(data => setMaterials(data))
            .catch(err => console.error('Filter error:', err));
    };

    const pickIcon = (name: string) => {
        const ext = name.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return pdfIcon;
        if (ext === 'docx') return docxIcon;
        if (ext === 'png' || ext === 'jpg') return pngIcon;
        return pngIcon;
    };
    const Icon = FiSearch as React.ElementType;

    return (
        <>
            <GlobalStyle />
            <Header toggleMenu={() => setShowMenu(o => !o)} />
            <Menu open={showMenu} />
            <Container>



                <Toolbar>
                    <Title>Materials</Title>
                    <SearchBar>
                        <Icon />
                        <SearchInput
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </SearchBar>
                    <TagFilter
                        value={selectedTag}
                        onChange={e => {
                            setSelectedTag(e.target.value);
                            handleFilter(e.target.value);
                        }}
                    >
                        <option value="">Tags</option>
                        {availableTags.map(tag => (
                            <option key={tag} value={tag}>
                                {tag.replace('_', ' ')}
                            </option>
                        ))}
                    </TagFilter>
                </Toolbar>

                <Underline />
                <Description style={{ fontSize: '1.1rem', background: '#f4f0e5', padding: '20px', borderRadius: '12px', margin: '20px 0 40px' }}>
                    Browse through a rich collection of <strong>educational materials</strong> shared by members of the community.
                    Whether you're preparing for an exam or simply exploring new topics, this space helps you discover
                    high-quality resources, organized by ratings and tags. 💡✨ <br />
                    Don’t forget—you can also contribute valuable content to support our mission of <strong>collaborative education</strong>! 📘🤝
                </Description>

                {filtered.map((mat, i) => {
                    const avg = mat.nrRatings > 0 ? mat.rating / mat.nrRatings : 0;
                    return (
                        <MaterialCard
                            key={mat.id || i}
                            onClick={() => navigate(`/materials/${mat.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <FileIcon src={pickIcon(mat.path)} alt={mat.path} />
                            <CardContent>
                                <MaterialTitle>{mat.name}</MaterialTitle>
                                <Description>{mat.description}</Description>
                                <Stars>{renderStars(avg)}</Stars>
                            </CardContent>
                            <PostedAndTags>
                                <InfoRow>
                                    {mat.tags?.map((tag: string, idx: number) => (
                                        <Tag key={idx} color={getTagColor(tag)}>
                                            {tag}
                                        </Tag>
                                    ))}
                                </InfoRow>
                                <Posted>
                                    Posted by <UserBadge>{mat.user?.name || 'Unknown'}</UserBadge>
                                </Posted>
                            </PostedAndTags>
                        </MaterialCard>
                    );
                })}

                <FloatingButton open={showMenu} onClick={() => navigate('/add-material')}>
                    Add Material
                </FloatingButton>
            </Container>
        </>
    );
};

export default MaterialsPage;


