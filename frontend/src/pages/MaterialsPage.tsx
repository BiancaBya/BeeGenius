import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BeeIcon from '../assets/Logo_cropped.png';
import BeeText from '../assets/LogoText.png';
import pdfIcon from '../assets/pdf.png';
import docxIcon from '../assets/docx.png';
import pngIcon from '../assets/png.png';
import {
    TiStarFullOutline,
    TiStarHalfOutline,
    TiStarOutline,
} from 'react-icons/ti';
import { FiSearch } from 'react-icons/fi';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');

  body {
    margin: 0;
    padding: 0;
    font-family: 'Josefin Sans', sans-serif;
    background-color: #fcf6e8;
  }
`;

const Header = styled.div`
    height: 70px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f7dca0;
    padding: 15px 40px;
    border-bottom: 2px solid #000;
`;
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const LogoImage = styled.img`
    height: 50px;
    object-fit: contain;
`;
const MenuButton = styled.button`
    background: #fff;
    border: 2px solid #000;
    border-radius: 10px;
    padding: 8px 20px;
    font-size: 1.2rem;
    cursor: pointer;
    margin: 0 70px;
`;
const Sidebar = styled.div<{ open: boolean }>`
    width: 250px;
    background: #f7dca0;
    height: calc(100vh - 70px);
    border-left: 2px solid #000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top: 102px;
    right: ${props => (props.open ? '0' : '-250px')};
    transition: right 0.3s ease-in-out;
    z-index: 1000;
`;
const MenuItems = styled.div`
    display: flex;
    flex-direction: column;
    padding: 30px 20px;
    gap: 30px;
    font-size: 1.4rem;
    font-weight: 500;
    border-bottom: 2px solid #000;
`;
const MenuItem = styled.div`
    cursor: pointer;
    &:hover { text-decoration: underline; }
`;
const Logout = styled.div`
    padding: 20px;
    font-size: 1.3rem;
    font-weight: bold;
    border-top: 2px solid #000;
    text-align: center;
    cursor: pointer;
    margin-bottom: 40px;
`;

const Container = styled.div`
    padding: 110px 40px;
`;

const SearchSort = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  background: #d5d0c4;
  cursor: pointer;
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
    margin-top: 0px;
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


const getTagColor = (tag: string) => {
    switch (tag) {
        case 'LAW': return '#f48c06';
        case 'COMPUTER_SCIENCE': return '#4ea8de';
        case 'MEDICINE': return '#3e8e41';
        case 'BIOLOGY': return '#8e44ad';
        case 'HISTORY': return '#c2112b';
        default: return '#6c757d';
    }
};
const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const empty = 5 - full - (half ? 1 : 0);
    return (
        <>
            {Array(full).fill(0).map((_, i) => <TiStarFullOutline key={i} />)}
            {half && <TiStarHalfOutline key="half" />}
            {Array(empty).fill(0).map((_, i) => <TiStarOutline key={i} />)}
        </>
    );
};

export const MaterialsPage: React.FC = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [materials, setMaterials] = useState<any[]>([]);
    const [search, setSearch] = useState<string>('');
    const [selectedTag, setSelectedTag] = useState('');

    useEffect(() => {
        fetchMaterials();
    }, []);


    const fetchMaterials = () => {
        fetch('http://localhost:8080/api/materials')
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => setMaterials(data))
            .catch(console.error);
    };

    const filtered = materials.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.description?.toLowerCase() || '').includes(search.toLowerCase())
    );

    const handleFilter = (tag: string) => {
        if (!tag) {
            fetchMaterials();
            return;
        }
        fetch(`http://localhost:8080/api/materials/filter?tag=${tag}`)
            .then(res => res.json())
            .then(data => setMaterials(data))
            .catch(err => console.error("Filter error:", err));
    };

    const pickIcon = (name: string) => {
        const ext = name.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return pdfIcon;
        if (ext === 'docx') return docxIcon;
        if (ext === 'png') return pngIcon;
        return docxIcon;
    };

    return (
        <>
            <GlobalStyle />
            <Header>
                <LogoContainer>
                    <LogoImage src={BeeIcon} alt="Bee" />
                    <LogoImage src={BeeText} alt="BeeGenius" />
                </LogoContainer>
                <MenuButton onClick={() => setShowMenu(o => !o)}>Menu</MenuButton>
            </Header>
            <Sidebar open={showMenu}>
                <MenuItems>
                    <MenuItem onClick={() => navigate('/userprofile')}>Profile</MenuItem>
                    <MenuItem onClick={() => navigate('/materials')}>Materials</MenuItem>
                    <MenuItem onClick={() => navigate('/forum')}>Forum</MenuItem>
                    <MenuItem onClick={() => navigate('/books')}>Books</MenuItem>
                    <MenuItem onClick={() => navigate('/mainpage')}>Home</MenuItem>
                </MenuItems>
                <Logout onClick={() => navigate('/')}>Log Out</Logout>
            </Sidebar>

            <Container>
                <Toolbar>
                    <Title>Materials</Title>
                    <SearchBar>
                        <FiSearch />
                        <SearchInput
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </SearchBar>
                    <TagFilter onChange={(e) => {
                        setSelectedTag(e.target.value);
                        handleFilter(e.target.value);
                    }}>
                        <option value="">Tags</option>
                        <option value="LAW">Law</option>
                        <option value="COMPUTER_SCIENCE">Computer Science</option>
                        <option value="MEDICINE">Medicine</option>
                        <option value="BIOLOGY">Biology</option>
                        <option value="HISTORY">History</option>
                    </TagFilter>

                </Toolbar>
                <Underline />

                {filtered.map((mat, i) => {
                    const avg = mat.nrRatings > 0
                        ? mat.rating / mat.nrRatings
                        : 0;

                    return (
                        <MaterialCard key={i}>
                            <FileIcon src={pickIcon(mat.path)} alt={mat.path} />
                            <CardContent>
                                <MaterialTitle>{mat.name}</MaterialTitle>
                                <Description>
                                    {mat.description}
                                </Description>
                                <Stars>{renderStars(avg)}</Stars>
                            </CardContent>
                            <PostedAndTags>
                                <InfoRow>
                                    {mat.tags?.map((tag: string, idx: number) => (
                                        <Tag key={idx} color={getTagColor(tag)}>{tag}</Tag>
                                    ))}
                                </InfoRow>
                                <Posted>
                                    Posted by
                                    <UserBadge>{mat.user?.name || 'Unknown'}</UserBadge>
                                </Posted>
                            </PostedAndTags>
                        </MaterialCard>
                    );
                })}
            </Container>
        </>
    );
};

export default MaterialsPage;
