import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from 'react-icons/ti';
import { FaRegComment } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
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
    &:hover {
        transform: scale(1.01);
    }
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
    &:hover {
        transform: scale(1.05);
    }
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

const PostLoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 1.2rem;
    color: #555;
`;

interface MaterialDTO {
    id: string;
    name: string;
    description?: string;
    type: string;
    path: string;
    rating: number;
    nrRatings: number;
    tags?: string[];
    user?: { name: string };
}

interface PostDTO {
    id: string;
    title: string;
    content: string;
    repliesCount: number;
    tags?: string[];
    user?: { name: string };
    timeAgo?: string;
}

interface Book {
    id: string;
    title: string;
    author: string;
    photoPath: string;
}

const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    return (
        <>
            {Array(fullStars)
                .fill(0)
                .map((_, i) => (
                    <TiStarFullOutline key={`full-${i}`} />
                ))}
            {hasHalf && <TiStarHalfOutline key="half" />}
            {Array(emptyStars)
                .fill(0)
                .map((_, i) => (
                    <TiStarOutline key={`empty-${i}`} />
                ))}
        </>
    );
};

const MainPage: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [materials, setMaterials] = useState<MaterialDTO[]>([]);
    const [posts, setPosts] = useState<PostDTO[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        fetch('http://localhost:8080/api/materials', {
            method:"GET",
            headers:{
                "Authorization": `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => setMaterials(data))
            .catch(err => console.error('Error loading materials:', err));

        fetch('http://localhost:8080/api/posts', {
            method:"GET",
            headers:{
                "Authorization": `Bearer ${token}`,
            }})
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPosts(data);
                } else if (Array.isArray(data.posts)) {
                    setPosts(data.posts);
                }
            })
            .catch(err => console.error('Error loading posts:', err))
            .finally(() => setLoadingPosts(false));

        fetch('http://localhost:8080/api/books', {
            method:"GET",
            headers:{
                "Authorization": `Bearer ${token}`,
            }})
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error('Error loading books:', err));
    }, []);

    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                <Header toggleMenu={() => setShowMenu(v => !v)} />
                <Menu open={showMenu} />
                <Container>
                    <Title>Highest Rated Materials</Title>
                    {materials
                        .sort((a, b) => {
                            const avgA = a.nrRatings > 0 ? a.rating / a.nrRatings : 0;
                            const avgB = b.nrRatings > 0 ? b.rating / b.nrRatings : 0;
                            return avgB - avgA;
                        })
                        .slice(0, 5)
                        .map((material, i) => (
                            <MaterialCard
                                key={`mat-${i}`}
                                onClick={() => navigate(`/materials/${material.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <MaterialTitle>{material.name}</MaterialTitle>
                                <InfoRow>
                                    <span>Posted by {material.user?.name || 'Unknown'}</span>
                                    {material.tags?.map((tag, idx) => (
                                        <Tag key={idx} color={getTagColor(tag)}>
                                            {tag.replace('_', ' ')}
                                        </Tag>
                                    ))}
                                    <Stars>
                                        {renderStars(
                                            material.nrRatings > 0
                                                ? material.rating / material.nrRatings
                                                : 0
                                        )}
                                    </Stars>
                                </InfoRow>
                            </MaterialCard>
                        ))}

                    <SectionTitle>Most Active Posts</SectionTitle>
                    {loadingPosts ? (
                        <PostLoadingContainer>Loading posts...</PostLoadingContainer>
                    ) : (
                        [...posts]
                            .filter(post => post.repliesCount > 0)
                            .sort((a, b) => b.repliesCount - a.repliesCount)
                            .slice(0, 5)
                            .map((post, i) => (
                                <MaterialCard
                                    key={`post-${i}`}
                                    onClick={() => navigate(`/post/${post.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <MaterialTitle>{post.title}</MaterialTitle>
                                    <InfoRow>
                                        <span>Posted by {post.user?.name || 'Unknown'}</span>
                                        {post.tags?.map((tag, idx) => (
                                            <Tag key={idx} color={getTagColor(tag)}>
                                                {tag.replace('_', ' ')}
                                            </Tag>
                                        ))}
                                    </InfoRow>
                                    <Description>
                                        {post.content?.length > 300
                                            ? post.content.slice(0, 300) + '...'
                                            : post.content}
                                    </Description>
                                </MaterialCard>
                            ))
                    )}

                    <SectionTitle>Latest Books</SectionTitle>
                    <BookGrid>
                        {[...books]
                            .slice(-5)
                            .reverse()
                            .map((book, i) => (
                                <BookCard
                                    key={`book-${i}`}
                                    onClick={() => navigate(`/books/${book.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
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
