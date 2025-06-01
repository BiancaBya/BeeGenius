import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FiTrash2 } from 'react-icons/fi';
import ConfirmModal from '../components/ConfirmModal';
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

const BookGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 30px;
`;

const BookCard = styled.div`
    background: #d5d0c4;
    padding: 35px 20px 20px;
    border-radius: 15px;
    text-align: center;
    position: relative;
    min-height: 230px;
`;

const DeleteButton = styled.button`
    background: none;
    border: none;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: #a00;

    &:hover {
        color: #d9534f;
    }
`;

const BookImage = styled.img`
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 10px;
    background: white;
`;

const BookTitle = styled.div`
    font-weight: 600;
    font-size: 1.1rem;
    margin-top: 10px;
`;

const BookAuthor = styled.div`
    font-size: 0.95rem;
    color: #333;
`;

const NoResults = styled.div`
  text-align: center;
  font-size: 1.5rem;
  margin-top: 50px;
  color: #666;
`;

const FloatingButton = styled.button<{ open: boolean }>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #ffc107;
  color: black;
  border: none;
  padding: 15px 25px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: ${props => props.open ? 999 : 1000}; 
    transition: all 0.2s ease;

  &:hover {
    background-color: #e6b800;
  }
`;

interface JwtPayload {
    id: string;
}

const ManageBooksPage: React.FC = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState<any[]>([]);
    const [userId, setUserId] = useState<string>('');
    const [showMenu, setShowMenu] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<string | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.id);

        fetch('http://localhost:8080/api/books')
            .then(res => res.json())
            .then(data => {
                const userBooks = data.filter((book: any) => book.owner?.id === decoded.id);
                setBooks(userBooks);
            });
    }, []);

    const handleDelete = (bookId: string) => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        fetch(`http://localhost:8080/api/books/${bookId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.ok) {
                    setBooks(prev => prev.filter(b => b.id !== bookId));
                    setBookToDelete(null);
                } else {
                    console.error("Failed to delete book");
                }
            });
    };

    return (
        <>
            <GlobalStyle />
            <Header toggleMenu={() => setShowMenu(!showMenu)} />
            <Menu open={showMenu} />
            <Container>
                <Title>Manage Your Books</Title>
                {books.length > 0 ? (
                    <BookGrid>
                        {books.map((book) => (
                            <BookCard key={book.id}>
                                <DeleteButton onClick={() => setBookToDelete(book.id)}>
                                    <FiTrash2 size={20} />
                                </DeleteButton>
                                <BookImage
                                    src={book.photoPath ? `http://localhost:8080/${book.photoPath.replace(/\\/g, '/')}` : ''}
                                    alt={book.title}
                                />
                                <BookTitle>{book.title}</BookTitle>
                                <BookAuthor>{book.author}</BookAuthor>
                            </BookCard>
                        ))}
                    </BookGrid>
                ) : (
                    <NoResults>📚 No books found.</NoResults>
                )}
            </Container>

            {bookToDelete && (
                <ConfirmModal
                    isOpen={true}
                    message="Are you sure you want to delete this book?"
                    onCancel={() => setBookToDelete(null)}
                    onConfirm={() => handleDelete(bookToDelete)}
                />
            )}

            <FloatingButton open={showMenu} onClick={() => navigate("/add-book", { state: { from: "/manage-books" } })}>
                Add Book
            </FloatingButton>
        </>
    );
};

export default ManageBooksPage;
