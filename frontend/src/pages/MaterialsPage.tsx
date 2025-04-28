// src/pages/MaterialsPage.tsx
import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import BeeIcon from '../assets/Logo_cropped.png';
import BeeText from '../assets/LogoText.png';
import pdfIcon from '../assets/pdf.png';
import docxIcon from '../assets/docx.png';
import pngIcon from '../assets/png.png';
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

// ————————————————————————————————————————————————————————————————————————————
// Global font + background (exactly as in MainPage)
const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');
    body {
        margin: 0;
        padding: 0;
        font-family: 'Josefin Sans', sans-serif;
        background-color: #fcf6e8;
    }
`;

// ————————————————————————————————————————————————————————————————————————————
// Layout / Menu (copy-pasted from MainPage)
const Header = styled.div`
    height: 70px;
    width: 100%;
    position: fixed;
    top: 0; left: 0;
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

// ————————————————————————————————————————————————————————————————————————————
// Page content styled-components (mostly lifted from MainPage)
const Container = styled.div`
    padding: 110px 40px;
`;
const Title = styled.h2`
  font-size: 2rem;
  margin: 30px 0 10px;
  border-bottom: 2px solid #000;
  width: fit-content;
`;

// card altered to a row with an icon on the left
const MaterialCard = styled.div`
    background: #d5d0c4;
    border-radius: 10px;
    padding: 16px 20px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
`;
const FileIcon = styled.img`
    width: 50px;
    height: 50px;
    object-fit: contain;
    margin-right: 20px;
`;
const MaterialTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 600;
`;
const InfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
`;
const Tag = styled.span<{ color: string }>`
    background: ${props => props.color};
    color: white;
    border-radius: 15px;
    padding: 4px 12px;
    font-size: 0.9rem;
    font-weight: 600;
`;
const Stars = styled.div`
    display: flex;
    font-size: 1.8rem;
    color: #ffc107;
    margin-left: auto;
`;

// ————————————————————————————————————————————————————————————————————————————
// Helpers (copy-paste)
const getTagColor = (tag: string) => {
    switch (tag) {
        case 'LAW':              return '#f48c06';
        case 'COMPUTER_SCIENCE': return '#4ea8de';
        case 'MEDICINE':         return '#3e8e41';
        case 'BIOLOGY':          return '#8e44ad';
        case 'HISTORY':          return '#c2112b';
        default:                 return '#6c757d';
    }
};
const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf   = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars= 5 - fullStars - (hasHalf ? 1 : 0);
    return (
        <>
            {Array(fullStars).fill(0).map((_, i) => <TiStarFullOutline key={`full-${i}`} />)}
            {hasHalf && <TiStarHalfOutline key="half" />}
            {Array(emptyStars).fill(0).map((_, i) => <TiStarOutline key={`empty-${i}`} />)}
        </>
    );
};

// ————————————————————————————————————————————————————————————————————————————
// Page Component
const MaterialsPage: React.FC = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [materials, setMaterials] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/materials')
            .then(res => {
                if (!res.ok) throw new Error('Error fetching materials');
                return res.json();
            })
            .then(data => setMaterials(data))
            .catch(console.error);
    }, []);

    const pickIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf')  return pdfIcon;
        if (ext === 'docx') return docxIcon;
        if (ext === 'png')  return pngIcon;
        return pdfIcon;
    };

    return (
        <>
            <GlobalStyle />

            <Header>
                <LogoContainer>
                    <LogoImage src={BeeIcon} alt="Bee Icon" />
                    <LogoImage src={BeeText} alt="BeeGenius Text" />
                </LogoContainer>
                <MenuButton onClick={() => setShowMenu(!showMenu)}>Menu</MenuButton>
            </Header>

            <Sidebar open={showMenu}>
                <div>
                    <MenuItems>
                        <MenuItem onClick={() => navigate('/userprofile')}>Profile</MenuItem>
                        <MenuItem onClick={() => navigate('/materials')}>Materials</MenuItem>
                        <MenuItem onClick={() => navigate('/forum')}>Forum</MenuItem>
                        <MenuItem onClick={() => navigate('/books')}>Books</MenuItem>
                        <MenuItem onClick={() => navigate('/mainpage')}>Home</MenuItem>
                    </MenuItems>
                </div>
                <Logout onClick={() => navigate('/')}>Log Out</Logout>
            </Sidebar>

            <Container>
                <Title>All Materials</Title>

                {materials.map((mat: any, i: number) => {
                    const avgRating = mat.nrRatings > 0 ? mat.rating / mat.nrRatings : 0;
                    return (
                        <MaterialCard key={i}>
                            <FileIcon src={pickIcon(mat.name)} alt={mat.name} />
                            <div style={{ flex: 1 }}>
                                <MaterialTitle>{mat.name}</MaterialTitle>
                                <InfoRow>
                                    <span>Posted by {mat.user?.name || 'Unknown'}</span>
                                    {mat.tags?.map((tag: string, idx: number) => (
                                        <Tag key={idx} color={getTagColor(tag)}>{tag}</Tag>
                                    ))}
                                    <Stars>{renderStars(avgRating)}</Stars>
                                </InfoRow>
                            </div>
                        </MaterialCard>
                    );
                })}
            </Container>
        </>
    );
};

export default MaterialsPage;
