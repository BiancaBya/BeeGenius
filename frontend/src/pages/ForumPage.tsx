import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaRegComment } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Header from '../components/Header';
import Menu from '../components/Menu';

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

const PostReplies = styled.div`
    margin-top: 10px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #555;
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
                <Header toggleMenu={() => setShowMenu(!showMenu)} />
                <Menu open={showMenu} />
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
                                <FaRegComment />
                                {post.replies ? (
                                    post.replies.length + post.replies.reduce((acc: number, reply: any) => acc + (reply.replies?.length || 0), 0)
                                ) : 0}
                            </PostReplies>
                        </ForumPostCard>
                    ))}
                </Container>
            </PageWrapper>
        </>
    );
};

export default ForumPage;
