import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BeeIcon from '../assets/Logo_cropped.png';
import BeeText from '../assets/LogoText.png';
import {jwtDecode} from "jwt-decode";
import {useWebSocket} from "../hooks/useWebSocket";
import {ToastContainer} from "react-toastify";

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
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
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
            <ToastContainer/>
        </>
    );
};

export default Header;
