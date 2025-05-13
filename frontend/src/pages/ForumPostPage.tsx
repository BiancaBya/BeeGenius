import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegComment } from "react-icons/fa";
import BeeIcon from '../assets/Logo_cropped.png';
import BeeText from '../assets/LogoText.png';
import {jwtDecode} from 'jwt-decode';

export interface JwtPayload{
    id:string;
}

const PageWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
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

const PostContainer = styled.div`
    background: #d5d0c4;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
`;

const CommentSection = styled.div`
    margin-top: 20px;
`;

const CommentBox = styled.div`
    margin-top: 12px;
    padding-left: 8px;
    font-size: 1.1rem; /* am mărit fontul aici */
`;

const ReplyBox = styled.div`
    margin-top: 8px;
    margin-left: 20px;
    padding-left: 8px;
    border-left: 3px solid #4ea8de; /* o culoare mai simpatică */
    background: #f9f9f9; /* un gri foarte deschis */
    font-size: 1.05rem;
    transition: background 0.3s ease;
`;




const NewCommentInput = styled.textarea`
    width: 99%;
    padding: 6px 8px;
    border-radius: 8px;
    margin-top: 8px;
    font-size: 0.9rem;
    height: 40px;
    resize: none;
    border: 1px solid #bbb;
`;



const SubmitButton = styled.button`
    margin-top: 10px;
    padding: 8px 20px;
    background: #ffc107;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        background: #e0a800;
    }
`;


const SectionTitle = styled.h2`
    font-size: 2rem;
    margin: 20px 0;
`;

export default function ForumPostPage() {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<any>(null);
    const [newComment, setNewComment] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState(''); // pentru textul scris
    const [user, setUser] = useState<{ id: string, name: string } | null>(null);


    const getuserId = () => {
        const token = jwtDecode<JwtPayload>(sessionStorage.getItem('token') as string);
        return token.id;
    }

    const getUserData = async () => {
        try {
            const userId = getuserId();
            if (!userId) return null;

            const token = sessionStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const user = await response.json();
            return { id: user.id, name: user.name };
        } catch (err) {
            console.error("Error fetching user data:", err);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch pentru post
                const postResponse = await fetch(`http://localhost:8080/api/posts/${postId}`);
                const postData = await postResponse.json();
                setPost(postData);

                // Fetch pentru user
                const userData = await getUserData();
                if (userData) {
                    setUser(userData);
                }
            } catch (err) {
                console.error("Eroare la fetch:", err);
            }
        };

        fetchData();
    }, [postId]);

    const handleAddComment = async () => {
        if (!newComment.trim() || !user) return;

        try {
            await fetch(`http://localhost:8080/api/replies/to-post/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    content: newComment,
                    user: { id: user.id, name: user.name }
                })
            });

            setNewComment('');
            window.location.reload(); // sau updatează doar comentariile
        } catch (err) {
            console.error("Eroare la adăugare comentariu:", err);
        }
    };


    const handleAddReply = async (replyId: string, replyContent: string) => {
        if (!replyContent.trim() || !user) return;

        try {
            await fetch(`http://localhost:8080/api/replies/to-reply/${replyId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    content: replyContent,
                    user: { id: user.id, name: user.name }
                })
            });

            // Reîncarcă postarea pentru a vedea reply-ul
            fetch(`http://localhost:8080/api/posts/${postId}`)
                .then(res => res.json())
                .then(data => setPost(data))
                .catch(err => console.error("Eroare la reload post:", err));

        } catch (err) {
            console.error("Eroare la adăugare reply:", err);
        }
    };



    const renderReplies = (replies: any[]) => {
        return replies.map((reply) => (
            <CommentBox key={reply.id}>
                <div style={{ fontSize: '1.1rem' }}>
                    <strong>{reply.user?.name || 'Anonim'}</strong>: {reply.content}
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#097cff',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            marginLeft: '8px'
                        }}
                        onClick={() => setReplyingTo(reply.id)}
                    >
                        Reply
                    </button>
                </div>

                {replyingTo === reply.id && (
                    <>
                        <NewCommentInput
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <SubmitButton
                                onClick={async () => {
                                    await handleAddReply(reply.id, replyContent);
                                    setReplyContent('');
                                    setReplyingTo(null);
                                }}
                            >
                                Send
                            </SubmitButton>

                            <SubmitButton
                                style={{ background: '#e0e0e0', color: '#333' }}
                                onClick={() => {
                                    setReplyingTo(null);
                                    setReplyContent('');
                                }}
                            >
                                Hide
                            </SubmitButton>
                        </div>

                    </>
                )}

                {reply.replies && reply.replies.length > 0 && (
                    <ReplyBox>
                        {renderReplies(reply.replies)}
                    </ReplyBox>
                )}
            </CommentBox>


        ));
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

    const countTotalReplies = (replies: any[]): number => {
        if (!replies) return 0;
        let count = replies.length;
        replies.forEach(reply => {
            if (reply.replies && reply.replies.length > 0) {
                count += countTotalReplies(reply.replies);
            }
        });
        return count;
    };

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


    return (
        <>
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
                    {post && (
                        <>
                            <PostContainer>
                                <h2>{post.title}</h2>
                                <p><strong>Posted by:</strong> {post.user?.name || 'Anonim'} • {post.date ? formatTimeAgo(post.date) : 'just now'}</p>

                                <div style={{ marginTop: '10px', marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {post.tags?.map((tag: string, index: number) => (
                                        <span key={index} style={{
                                            background: getTagColor(tag),
                                            color: 'white',
                                            padding: '5px 10px',
                                            borderRadius: '15px',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem'
                                        }}>
                {tag}
            </span>
                                    ))}
                                </div>

                                <p><FaRegComment /> {countTotalReplies(post.replies)} comments</p>

                                <p>{post.content}</p>
                            </PostContainer>


                            <SectionTitle>Comments</SectionTitle>

                            <NewCommentInput
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <SubmitButton onClick={handleAddComment}>Post Comment</SubmitButton>

                            <CommentSection>
                                {post.replies && renderReplies(post.replies)}
                            </CommentSection>
                        </>
                    )}
                </Container>
            </PageWrapper>
        </>
    );
}