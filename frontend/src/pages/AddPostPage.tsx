import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Menu from "../components/Menu";
import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
    id: string;
}

const PageWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fcf6e8; /* Fundalul paginii */
`;

const Container = styled.div`
    width: 100%;
    max-width: 500px;
    margin-top: 190px;
    padding: 30px;
    background-color: #ffffff; /* Fundalul formularului */
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.h2`
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    text-decoration: underline;
`;

const TitleInput = styled.input`
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
`;

const ContentInput = styled.textarea`
    width: 100%;
    padding: 12px;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 15px;
    font-size: 1rem;
`;

const TagSelect = styled.select`
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 15px;
    height: 100px;
    font-size: 1rem;
    background-color: #fff;
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 12px;
    background-color: #ffc107;
    color: black;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
        background-color: #e6b800;
    }
`;

const AddPostPage = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);

    const getuserId = () => {
        const token = jwtDecode<JwtPayload>(sessionStorage.getItem("token") as string);
        return token.id;
    };

    const getUserData = async () => {
        try {
            const userId = getuserId();
            if (!userId) return null;

            const token = sessionStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const user = await response.json();
            return { id: user.id, name: user.name };
        } catch (err) {
            console.error("Error fetching user data:", err);
            return null;
        }
    };

    useEffect(() => {
        getUserData().then(userData => {
            if (userData) {
                setUser(userData);
            }
        });
    }, []);

    const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setTags(selectedOptions);
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim() || !user) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    content,
                    tags: tags,
                    user: { id: user.id, name: user.name },
                }),
            });

            if (response.ok) {
                navigate("/forum");
            } else {
                console.error("Failed to add post.");
            }
        } catch (err) {
            console.error("Error in handleSubmit:", err);
        }
    };

    return (
        <PageWrapper>
            <Header toggleMenu={() => setShowMenu(!showMenu)} />
            <Menu open={showMenu} />

            <Container>
                <Title>Add a New Post</Title>

                <TitleInput
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <ContentInput
                    placeholder="Description"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <TagSelect multiple value={tags} onChange={handleTagChange}>
                    <option value="LAW">Law</option>
                    <option value="COMPUTER_SCIENCE">Computer Science</option>
                    <option value="MEDICINE">Medicine</option>
                    <option value="BIOLOGY">Biology</option>
                    <option value="HISTORY">History</option>
                </TagSelect>

                <SubmitButton onClick={handleSubmit}>Add Post</SubmitButton>
            </Container>
        </PageWrapper>
    );
};

export default AddPostPage;

