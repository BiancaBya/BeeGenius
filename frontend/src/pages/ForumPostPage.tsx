import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegComment } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';
import { getTagColor } from '../utils/tagColorGenerator';
import Header from '../components/Header';
import Menu from '../components/Menu';

export interface JwtPayload {
    id: string;
}

const PageWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    padding: 110px 40px;
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
    font-size: 1.1rem;
`;

const ReplyBox = styled.div`
    margin-top: 8px;
    margin-left: 20px;
    padding-left: 8px;
    border-left: 3px solid #4ea8de;
    background: #f9f9f9;
    font-size: 1.05rem;
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

const TagPill = styled.span<{ color: string }>`
    background: ${props => props.color};
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-right: 8px;
    margin-top: 8px;
    display: inline-block;
`;

export default function ForumPostPage() {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<any>(null);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const getUserId = (): string | null => {
        try {
            const tokenRaw = sessionStorage.getItem('token');
            if (!tokenRaw) return null;
            const decoded = jwtDecode<JwtPayload>(tokenRaw);
            return decoded.id;
        } catch {
            return null;
        }
    };

    const getUserData = async () => {
        try {
            const userId = getUserId();
            if (!userId) return null;


            const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Failed to fetch user data");

            const userData = await response.json();
            return { id: userData.id, name: userData.name };
        } catch (err) {
            console.error("Error fetching user data:", err);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postResponse = await fetch(`${BASE_URL}/api/posts/${postId}`, {headers:{
                        "Authorization": `Bearer ${token}`,
                    }
                });
                const postData = await postResponse.json();
                setPost(postData);

                const userData = await getUserData();
                if (userData) setUser(userData);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, [postId]);

    const handleAddComment = async () => {
        if (!newComment.trim() || !user) return;

        try {
            await fetch(`${BASE_URL}api/replies/to-post/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: newComment,
                    user: { id: user.id, name: user.name }
                })
            });

            setNewComment('');
            const postResponse = await fetch(`${BASE_URL}/api/posts/${postId}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const updatedPost = await postResponse.json();
            setPost(updatedPost);
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    const handleAddReply = async (replyId: string, replyText: string) => {
        if (!replyText.trim() || !user) return;

        try {
            await fetch(`${BASE_URL}/api/replies/to-reply/${replyId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: replyText,
                    user: { id: user.id, name: user.name }
                })
            });

            const postResponse = await fetch(`${BASE_URL}/api/posts/${postId}`, {
            headers:  {'Authorization': `Bearer ${token}`}
            });
            const updatedPost = await postResponse.json();
            setPost(updatedPost);
        } catch (err) {
            console.error("Error adding reply:", err);
        }
    };

    const renderReplies = (replies: any[]): React.ReactNode => replies.map(reply => (
        <CommentBox key={reply.id}>
            <div>
                <strong>{reply.user?.name || 'Anonim'}</strong>: {reply.content}
                <button onClick={() => setReplyingTo(reply.id)} style={{ marginLeft: 8, color: '#097cff', background: 'none', border: 'none', cursor: 'pointer' }}>Reply</button>
            </div>
            {replyingTo === reply.id && (
                <>
                    <NewCommentInput
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        autoFocus
                    />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <SubmitButton onClick={async () => { await handleAddReply(reply.id, replyContent); setReplyContent(''); setReplyingTo(null); }}>Send</SubmitButton>
                        <SubmitButton style={{ background: '#e0e0e0', color: '#333' }} onClick={() => { setReplyingTo(null); setReplyContent(''); }}>Hide</SubmitButton>
                    </div>
                </>
            )}
            {reply.replies && reply.replies.length > 0 && (
                <ReplyBox>{renderReplies(reply.replies)}</ReplyBox>
            )}
        </CommentBox>
    ));

    const formatTimeAgo = (timestamp: string | Date) => {
        const postDate = new Date(timestamp);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
        const mins = Math.floor(seconds / 60);
        const hours = Math.floor(seconds / 3600);
        const days = Math.floor(seconds / 86400);
        const months = Math.floor(seconds / 2592000);
        const years = Math.floor(seconds / 31536000);
        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
        if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (mins > 0) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
        return 'just now';
    };

    const Icon = FaRegComment as React.ElementType;

    return (
        <PageWrapper>
            <Header toggleMenu={() => setShowMenu(v => !v)} />
            <Menu open={showMenu} />
            <Container>
                {post && (
                    <>
                        <PostContainer>
                            <h2>{post.title}</h2>
                            <p><strong>Posted by:</strong> {post.user?.name || 'Anonim'} • {post.date ? formatTimeAgo(post.date) : 'just now'}</p>
                            <div style={{ margin: '10px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {post.tags?.map((tag: string, index: number) => (
                                    <TagPill key={index} color={getTagColor(tag)}>{tag.replace('_', ' ')}</TagPill>
                                ))}
                            </div>
                            <p><Icon /> {post.replies?.length || 0} comments</p>
                            <p>{post.content}</p>
                        </PostContainer>
                        <SectionTitle>Comments</SectionTitle>
                        <NewCommentInput placeholder="Write a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} />
                        <SubmitButton onClick={handleAddComment}>Post Comment</SubmitButton>
                        <CommentSection>{post.replies && renderReplies(post.replies)}</CommentSection>
                    </>
                )}
            </Container>
        </PageWrapper>
    );
}
