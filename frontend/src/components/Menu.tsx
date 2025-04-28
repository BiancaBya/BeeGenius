import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Sidebar = styled.div<{ open: boolean }>`
    width: 250px;
    background: #f7dca0;
    height: calc(100vh - 70px);
    border-left: 2px solid #000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top: 100px;
    right: ${props => (props.open ? '0' : '-250px')};
    transition: right 0.3s ease-in-out;
    z-index: 1000;
`;

const MenuItems = styled.div`
    display: flex;
    flex-direction: column;
    padding: 25px 20px;
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
    margin-bottom: 30px;
`;

interface MenuProps {
    open: boolean;
}

const Menu: React.FC<MenuProps> = ({ open }) => {
    const navigate = useNavigate();

    return (
        <Sidebar open={open}>
            <div>
                <MenuItems>
                    <MenuItem onClick={() => navigate('/userprofile')}>Profile</MenuItem>
                    <MenuItem onClick={() => navigate('/materials')}>Materials</MenuItem>
                    <MenuItem onClick={() => navigate('/forum')}>Forum</MenuItem>
                    <MenuItem onClick={() => navigate('/books')}>Books</MenuItem>
                    <MenuItem onClick={() => navigate('/mainpage')}>Home</MenuItem>
                </MenuItems>
            </div>
            <Logout onClick={() => navigate('/')}>Log Out</Logout>
        </Sidebar>
    );
};

export default Menu;
