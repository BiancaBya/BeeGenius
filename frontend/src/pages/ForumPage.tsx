import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import BeeIcon from '../assets/Logo_cropped.png';
import BeeText from '../assets/LogoText.png';
import { FaRegComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const PostReplies = styled.div`
    margin-top: 10px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #555;
`;

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

const SectionTitle = styled.h2`
    font-size: 2rem;
    margin: 30px 0 20px;
    width: fit-content;
`;

const Tag = styled.span<{ color: string }>`
    background: ${props => props.color};
    color: white;
    border-radius: 15px;
    padding: 4px 12px;
    font-size: 0.9rem;
    font-weight: 600;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
    flex-wrap: wrap;
`;

const ForumPostCard = styled.div`
    background: #d5d0c4;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 16px;
`;

const PostHeader = styled.div`
    font-size: 0.95rem;
    color: #222;
    margin-bottom: 8px;
`;

const PostTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 600;
`;

const PostContent = styled.div`
    font-size: 1rem;
    color: #333;
    margin-top: 6px;
`;

const Toolbar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 10px;
    flex-wrap: wrap;
`;

const ToolbarSection = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Underline = styled.div`
    height: 2px;
    width: 100%;
    background-color: black;
    margin: 10px 0 30px;
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
    min-width: 200px;
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

const formatTimeAgo = (timestamp: string | Date) => {
    const postDate = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;

    return 'just now';
};

const ForumPage = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/posts')
            .then(res => res.json())
            .then(data => setAllPosts(data))
            .catch(err => console.error("Eroare la posturi:", err));
    }, []);

    const filteredPosts = allPosts.filter((post: any) => {
        const matchesSearch =
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.content.toLowerCase().includes(search.toLowerCase());
        const matchesTag =
            !selectedTag || post.tags?.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

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
                        <ToolbarSection>
                            <SectionTitle>Forum</SectionTitle>
                        </ToolbarSection>

                        <SearchBar>
                            <FiSearch />
                            <SearchInput
                                type="text"
                                placeholder="Search posts"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </SearchBar>

                        <TagFilter
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                        >
                            <option value="">All Tags</option>
                            <option value="LAW">Law</option>
                            <option value="COMPUTER_SCIENCE">Computer Science</option>
                            <option value="MEDICINE">Medicine</option>
                            <option value="BIOLOGY">Biology</option>
                            <option value="HISTORY">History</option>
                        </TagFilter>
                    </Toolbar>

                    <Underline />

                    {[...filteredPosts].reverse().map((post: any, index: number) => (
                        <ForumPostCard key={index}>
                            <PostHeader>{post.user?.name || 'Anonim'} • {post.date ? formatTimeAgo(post.date) : 'just now'}</PostHeader>
                            <PostTitle>{post.title}</PostTitle>
                            <PostContent>{post.content}</PostContent>
                            <InfoRow>
                                {post.tags?.map((tag: string, i: number) => (
                                    <Tag key={i} color={getTagColor(tag)}>{tag}</Tag>
                                ))}
                            </InfoRow>
                            <PostReplies>
                                <FaRegComment /> {post.replies?.length || 0}
                            </PostReplies>
                        </ForumPostCard>
                    ))}
                </Container>
            </PageWrapper>
        </>
    );
};

export default ForumPage;
