import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaBook, FaBoxOpen, FaEnvelope } from 'react-icons/fa';
import backgroundImage from '../assets/profile_background.png';
import Header from '../components/Header';
import Menu from '../components/Menu';
import {useNavigate} from "react-router-dom";

const PageWrapper = styled.div`
  min-height: 100vh;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center 100px;
  background-attachment: fixed;
  font-family: 'Josefin Sans', sans-serif;
`;

const Container = styled.div`
  padding: 200px 40px 40px;
  display: flex;
  justify-content: center;
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

const Name = styled.h2`
  font-size: 1.6rem;
  margin-bottom: 5px;
`;

const Email = styled.p`
  color: #555;
  margin-bottom: 30px;
  font-size: 0.95rem;
`;

const Button = styled.button`
  background-color: #f7d06f;
  border: 2px solid #000;
  color: black;
  font-weight: bold;
  font-size: 1rem;
  padding: 12px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 16px;
  cursor: pointer;

  &:hover {
    background-color: #f8b400;
  }
`;

const UserProfilePage: React.FC = () => {
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser({ name: 'John Doe', email: 'john@example.com' });
        }
    }, []);

    return (
        <PageWrapper>
            <Header toggleMenu={() => setShowMenu(!showMenu)} />
            <Menu open={showMenu} />
            <Container>
                <ProfileCard>
                    <Name>{user?.name}</Name>
                    <Email>{user?.email}</Email>

                    <Button onClick={() => navigate('/manage-books')}>
                        <FaBook />
                        Manage Books
                    </Button>
                    <Button>
                        <FaBoxOpen />
                        Manage Materials
                    </Button>
                    <Button>
                        <FaEnvelope />
                        Manage Requests
                    </Button>
                </ProfileCard>
            </Container>
        </PageWrapper>
    );
};

export default UserProfilePage;
