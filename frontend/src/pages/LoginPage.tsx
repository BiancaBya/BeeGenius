import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import LoginBg from '../assets/background.jpg';
import { useNavigate } from "react-router-dom";
import { notifyError } from "../utils/Notify";

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');

    body {
        margin: 0;
        padding: 0;
        font-family: 'Josefin Sans', sans-serif;
    }
`;

const Page = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: url(${LoginBg}) center/cover no-repeat;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 80px;
    margin-top: -80px;
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

const LoginBox = styled.div`
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #000;
    border-radius: 10px;
    padding: 40px;
    width: 250px;
    height: 300px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const FormTitle = styled.h2`
    font-size: 2.5rem;
    margin: 0 0 40px;
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

const Button = styled.button`
    display: block;
    width: 50%;
    height: 45px;
    padding: 10px;
    margin: 20px auto;
    background: #ffc107;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
`;

const FooterText = styled.p`
    font-size: 0.9rem;
    margin-top: 25px;
    text-align: center;
`;

const SignUpLink = styled.a`
    color: #1565c0;
    text-decoration: none;
    margin-left: 4px;
`;

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            notifyError("Please fill in all fields.");
            return;
        }

        try {
            const url = new URL("http://localhost:8080/api/auth/login");
            url.searchParams.append("email", email);
            url.searchParams.append("password", password);

            const res = await fetch(url.toString(), { method: "POST" });
            const text = await res.text();

            if (!res.ok) {
                notifyError(`Login failed: ${text}`);
                return;
            }

            const data = JSON.parse(text);
            const token = data.token;

            sessionStorage.setItem("token", token);
            navigate("/mainpage");
        } catch (err) {
            notifyError(
                "Login failed: " + (err instanceof Error ? err.message : "Unknown error")
            );
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

                <LoginBox>
                    <FormTitle>Login</FormTitle>
                    <form onSubmit={handleLogin}>
                        <Input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit">Log in</Button>
                    </form>
                    <FooterText>
                        Don’t have an account?
                        <SignUpLink href="/signup">Sign up!</SignUpLink>
                    </FooterText>
                </LoginBox>
            </Page>
        </>
    );
}
