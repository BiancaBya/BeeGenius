import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BeeIcon from '../assets/Logo_cropped.png';
import BeeText from '../assets/LogoText.png';
import { ToastContainer } from 'react-toastify';

const HeaderContainer = styled.div`
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

    @media (max-width: 600px) {
        padding: 10px 20px;
        height: 60px;
    }
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    @media (max-width: 600px) {
        gap: 5px;
    }
`;

const LogoImage = styled.img`
    height: 50px;
    object-fit: contain;

    @media (max-width: 600px) {
        height: 40px;
    }
`;

const MenuButton = styled.button`
    background: #fff;
    border: 2px solid #000;
    border-radius: 10px;
    padding: 8px 20px;
    font-size: 1.2rem;
    cursor: pointer;
    margin: 0 70px; 

    @media (max-width: 800px) {
        margin: 0 20px;
        padding: 6px 16px;
        font-size: 1rem;
    }
    @media (max-width: 600px) {
        margin: 0 10px;
        padding: 4px 12px;
        font-size: 0.9rem;
        border-radius: 8px;
    }
`;

interface HeaderProps {
    toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/mainpage');
    };

    return (
        <>
            <HeaderContainer>
                <LogoContainer onClick={handleLogoClick}>
                    <LogoImage src={BeeIcon} alt="Bee" />
                    <LogoImage src={BeeText} alt="Bee Genius" />
                </LogoContainer>
                <MenuButton onClick={toggleMenu}>Menu</MenuButton>
            </HeaderContainer>
            <ToastContainer />
        </>
    );
};

export default Header;
