import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import BeeIcon from '../assets/Logo_cropped.png';
import BeeText from '../assets/LogoText.png';
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";
import {useNavigate} from "react-router-dom";

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
    position: relative;
    margin: 0 70px;
`;



const Title = styled.h2`
    font-size: 2rem;
    margin: 30px 0 10px;
    border-bottom: 2px solid #000;
    width: fit-content;
`;

const MaterialCard = styled.div`
    background: #d5d0c4;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
`;

const MaterialTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 600;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
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

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin: 50px 0 20px;
  border-bottom: 2px solid #000;
  width: fit-content;
`;

const Description = styled.div`
  margin-top: 8px;
  font-size: 0.95rem;
  color: #222;
  line-height: 1.4;
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
  &:hover {
    text-decoration: underline;
  }
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

const PageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 30px;
`;

const BookCard = styled.div`
  background: #d5d0c4;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
`;

const BookImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  background: white;
`;

const BookTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 10px;
`;

const BookAuthor = styled.div`
  font-size: 0.95rem;
  color: #333;
`;



const getTagColor = (tag: string) => {
    switch (tag) {
        case 'LAW':
            return '#f48c06';
        case 'COMPUTER_SCIENCE':
            return '#4ea8de';
        case 'MEDICINE':
            return '#3e8e41';
        case 'BIOLOGY':
            return '#8e44ad';
        case 'HISTORY':
            return '#c2112b';
        default:
            return '#6c757d';
    }
};

const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
        <>
            {Array(fullStars).fill(0).map((_, i) => <TiStarFullOutline key={`full-${i}`} />)}
            {hasHalf && <TiStarHalfOutline key="half" />}
            {Array(emptyStars).fill(0).map((_, i) => <TiStarOutline key={`empty-${i}`} />)}
        </>
    );
};

const MainPage = () => {
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [posts, setPosts] = useState([]);
    const [books, setBooks] = useState([]);



    useEffect(() => {
        fetch('http://localhost:8080/api/materials')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Eroare la preluarea materialelor');
                }
                return response.json();
            })
            .then(data => setMaterials(data))
            .catch(error => console.error('Eroare:', error));

        fetch('http://localhost:8080/api/posts')
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error("Eroare la posturi:", err));

        fetch('http://localhost:8080/api/books')
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error("Eroare la cărți:", err));

    }, []);

    return (
        <>
            <GlobalStyle />
            <PageWrapper>
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
                            <MenuItem>Materials</MenuItem>
                            <MenuItem>Forum</MenuItem>
                            <MenuItem>Books</MenuItem>
                            <MenuItem onClick={()=> navigate('/mainpage')}>Home</MenuItem>
                        </MenuItems>
                    </div>
                    <Logout onClick={() => navigate('/')}>Log Out</Logout>
                </Sidebar>

                <Container>
                    <Title>Latest materials</Title>
                    {materials.map((mat: any, i: number) => {
                        const averageRating = mat.nrRatings > 0 ? mat.rating / mat.nrRatings : 0;
                        return (
                            <MaterialCard key={i}>
                                <MaterialTitle>{mat.name}</MaterialTitle>
                                <InfoRow>
                                    <span>Posted by {mat.user?.name || 'Unknown'}</span>
                                    {mat.tags?.map((tag: string, index: number) => (
                                        <Tag key={index} color={getTagColor(tag)}>{tag}</Tag>
                                    ))}
                                    <Stars>{renderStars(averageRating)}</Stars>
                                </InfoRow>
                            </MaterialCard>
                        );
                    })}

                    <SectionTitle>Most Active Posts</SectionTitle>
                    {[...posts]
                        .filter((post: any) => post.replies?.length > 0)
                        .sort((a: any, b: any) => b.replies.length - a.replies.length)
                        .slice(0, 5)
                        .map((post: any, i: number) => (
                            <MaterialCard key={`post-${i}`}>
                                <MaterialTitle>{post.title}</MaterialTitle>
                                <InfoRow>
                                    <span>Posted by {post.user?.name || 'Unknown'}</span>
                                    {post.tags?.map((tag: string, index: number) => (
                                        <Tag key={index} color={getTagColor(tag)}>{tag}</Tag>
                                    ))}
                                </InfoRow>
                                <Description>
                                    {post.content?.length > 300
                                        ? post.content.slice(0, 300) + '...'
                                        : post.content}
                                </Description>
                            </MaterialCard>
                        ))}

                    <SectionTitle>Latest books</SectionTitle>
                    <BookGrid>
                        {[...books]
                            .slice(-5)
                            .reverse()
                            .map((book: any, index: number) => (

                            <BookCard key={index}>
                                <BookImage
                                    src={`http://localhost:8080/${book.photoPath.replace(/\\/g, '/')}`}
                                    alt={book.title}
                                />


                                <BookTitle>{book.title}</BookTitle>
                                <BookAuthor>{book.author}</BookAuthor>
                            </BookCard>
                        ))}
                    </BookGrid>



                </Container>
            </PageWrapper>
        </>

    );
};

export default MainPage;
