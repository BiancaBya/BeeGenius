import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { useNavigate } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Josefin Sans', sans-serif;
    background-color: #fcf6e8;
  }
`;

const Container = styled.div`
  padding: 120px 40px;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
  border-bottom: 2px solid #000;
  width: fit-content;
`;

const RequestCard = styled.div`
  background: #d5d0c4;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RequestInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BookTitle = styled.div`
  font-weight: bold;
`;

const Buttons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button<{ variant: 'accept' | 'decline' }>`
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  background-color: ${props => props.variant === 'accept' ? '#28a745' : '#dc3545'};

  &:hover {
    background-color: ${props => props.variant === 'accept' ? '#218838' : '#c82333'};
  }
`;

const NoResults = styled.div`
  text-align: center;
  font-size: 1.5rem;
  margin-top: 50px;
  color: #666;
`;

interface JwtPayload {
    id: string;
}

const ManageBookRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [userId, setUserId] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.id);

        fetch(`${BASE_URL}/api/book-requests/${decoded.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (res.status === 204) return [];
                return res.json();
            })
            .then(data => {
                setRequests(data || []);
            })
            .catch(err => console.error("Failed to fetch book requests", err));
    }, []);

    const handleAction = (id: string, action: 'accept' | 'decline') => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        fetch(`${BASE_URL}/api/book-requests/${id}/${action}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(res => {
            if (res.ok) {
                setRequests(prev => {
                    if (action === 'accept') {

                        const acceptedRequest = prev.find(r => r.id === id);
                        const bookId = acceptedRequest?.book?.id;

                        return prev.filter(r => r.book?.id !== bookId);
                    } else {

                        return prev.filter(r => r.id !== id);
                    }
                });
            } else {
                console.error(`Failed to ${action} request`);
            }
        });
    };

    return (
        <>
            <GlobalStyle />
            <Header toggleMenu={() => setShowMenu(!showMenu)} />
            <Menu open={showMenu} />
            <Container>
                <Title>Manage Book Requests</Title>
                <ActionButton variant="accept" onClick={() => navigate('/my-requests')}>
                    Your request
                </ActionButton>
                {requests.length > 0 ? (
                    requests.map(req => (
                        <RequestCard key={req.id}>
                            <RequestInfo>
                                <div>
                                    <BookTitle>{req.book?.title}</BookTitle>
                                    <div>Author: {req.book?.author}</div>
                                    <div>Requested by: {req.requester?.name}</div>
                                    <div>Date: {req.date}</div>
                                    <div>Status: {req.status}</div>
                                </div>
                            </RequestInfo>
                            {req.status === 'PENDING' && (
                                <Buttons>
                                    <ActionButton variant="accept" onClick={() => handleAction(req.id, 'accept')}>Accept</ActionButton>
                                    <ActionButton variant="decline" onClick={() => handleAction(req.id, 'decline')}>Decline</ActionButton>
                                </Buttons>
                            )}
                        </RequestCard>
                    ))
                ) : (
                    <NoResults>📬 No book requests found.</NoResults>
                )}
            </Container>
        </>
    );
};

export default ManageBookRequestsPage;
