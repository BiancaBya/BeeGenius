import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaBook, FaBoxOpen, FaEnvelope } from 'react-icons/fa';
import BeeIcon from '../assets/Logo_cropped.png';
import BeeText from '../assets/LogoText.png';
import backgroundImage from '../assets/profile_background.png';
import { useNavigate } from 'react-router-dom';

// Styles

const PageWrapper = styled.div`
    min-height: 100vh;
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center 100px;
    background-attachment: fixed;
    font-family: 'Josefin Sans', sans-serif;
`;

const Header = styled.div`
    height: 70px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
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

// Sidebar styles

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

// Page content

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

// Component

const UserProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [showMenu, setShowMenu] = useState(false);

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
                <ProfileCard>
                    <Name>{user?.name}</Name>
                    <Email>{user?.email}</Email>

                    <Button>
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
