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
    background-color: #fcf6e8;
`;

const Container = styled.div`
    width: 100%;
    max-width: 500px;
    margin-top: 190px;
    padding: 30px;
    background-color: #ffffff;
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

const AddPostPage: React.FC = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);
    const token = sessionStorage.getItem("token");

    const getUserId = (): string | null => {
        try {
            const raw = sessionStorage.getItem("token");
            if (!raw) return null;
            const decoded = jwtDecode<JwtPayload>(raw);
            return decoded.id;
        } catch {
            return null;
        }
    };

    const fetchUserData = async () => {
        try {
            const userId = getUserId();
            if (!userId) return;


            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to load user data");
            const u = await response.json();
            setUser({ id: u.id, name: u.name });
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/tags",{headers:{
                "Authorization": `Bearer ${token}`,
            }
        });
            if (!response.ok) throw new Error("Failed to load tags");
            const tags: string[] = await response.json();
            setAvailableTags(tags);
        } catch (err) {
            console.error("Error loading tags:", err);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchTags();
    }, []);

    // When the user changes the <select multiple> choices
    const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const chosen = Array.from(e.target.selectedOptions, (opt) => opt.value);
        setSelectedTags(chosen);
    };

    // Send the POST /api/posts request
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
                    tags: selectedTags,
                    user: { id: user.id, name: user.name },
                }),
            });

            if (response.ok) {
                navigate("/forum");
            } else {
                console.error("Failed to add post");
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

                <TagSelect
                    multiple
                    value={selectedTags}
                    onChange={handleTagChange}
                >
                    {availableTags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag.replace("_", " ")}
                        </option>
                    ))}
                </TagSelect>

                <SubmitButton onClick={handleSubmit}>Add Post</SubmitButton>
            </Container>
        </PageWrapper>
    );
};

export default AddPostPage;
