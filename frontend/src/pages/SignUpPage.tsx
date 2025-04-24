import React, {useState} from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import LoginBg from '../assets/background.jpg';
import {useNavigate} from "react-router-dom";

// Import and apply Josefin Sans globally
const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');

    body {
        margin: 0;
        padding: 0;
        font-family: 'Josefin Sans', sans-serif;
    }
`;

// Full-page container with background
const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: url(${LoginBg}) center/cover no-repeat;
`;

// Site header above the signup card
const Header = styled.div`
    text-align: center;
    margin-bottom: 40px;
    margin-top: -40px;
`;

const SiteTitle = styled.h1`
    font-size: 3rem;
    margin: 0;
`;

const SiteSubtitle = styled.p`
    font-size: 1.5rem;
    font-weight: 500;
    margin: 4px 0;
`;

// Signup card
const SignupBox = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #000;
  border-radius: 10px;
  padding: 40px;
  width: 250px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

// Form-specific title
const FormTitle = styled.h2`
  font-size: 2.5rem;
  margin: 0 0 32px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 0 10px 10px;
  margin-bottom: 16px;
  border: none;
  border-radius: 4px;
  background: #e0e0e0;
  font-size: 1rem;
`;

// Smaller, centered signup button
const Button = styled.button`
  display: block;
  width: 50%;
  height: 45px;
  padding: 10px;
  margin: 20px auto 0;
  background: #ffc107;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
`;

const FooterText = styled.p`
  font-size: 0.9rem;
  margin-top: 16px;
  text-align: center;
`;

const LoginLink = styled.a`
  color: #1565c0;
  text-decoration: none;
  margin-left: 4px;
`;

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirm) {
            // notifyError('Passwords do not match');
            return;
        }
        try {
            const res = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                const msg = data?.message || res.statusText;
                // notifyError(`Signup failed: ${msg}`);
                return;
            }
            sessionStorage.setItem('user', JSON.stringify(data));
            navigate('/', { replace: true });
        } catch (err) {
            // notifyError(`Signup failed: ${err.message}`);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Page>
                <Header>
                    <SiteTitle>BEEGENIUS</SiteTitle>
                    <SiteSubtitle>Where curiosity meets community.</SiteSubtitle>
                </Header>

                <SignupBox>
                    <FormTitle>Signup</FormTitle>
                    <form onSubmit={handleSignup}>
                        <Input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Repeat Password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                        <Button type="submit">Sign up</Button>
                    </form>
                    <FooterText>
                        Already have an account?
                        <LoginLink href="/login">Log in!</LoginLink>
                    </FooterText>
                </SignupBox>
            </Page>
        </>
    );
}

