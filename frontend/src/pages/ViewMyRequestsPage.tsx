import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/Header';
import Menu from '../components/Menu';

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
`;

const Message = styled.div`
  font-size: 1.2rem;
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

const ViewMyRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode<JwtPayload>(token);

        fetch(`http://localhost:8080/api/book-requests/requester/${decoded.id}`, {
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
            .catch(err => console.error("Failed to fetch requests", err));
    }, []);


    return (
        <>
            <GlobalStyle />
            <Header toggleMenu={() => setShowMenu(!showMenu)} />
            <Menu open={showMenu} />
            <Container>
                <Title>Your Accepted Requests</Title>
                {requests.length > 0 ? (
                    requests.map(req => (
                        <RequestCard key={req.id}>
                            <Message>
                                {req.book?.owner?.name} accepted your request for <strong>{req.book?.title}</strong>.
                            </Message>
                        </RequestCard>
                    ))
                ) : (
                    <NoResults>📬 You have no accepted requests.</NoResults>
                )}
            </Container>
        </>
    );
};

export default ViewMyRequestsPage;
