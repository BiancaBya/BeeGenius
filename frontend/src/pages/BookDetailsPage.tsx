import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        font-family: 'Josefin Sans', sans-serif;
        background-color: #fcf6e8;
    }
`;

const PageContainer = styled.div`
    padding: 150px 40px 40px 40px;
`;

const BookDetailsContainer = styled.div`
    display: flex;
    gap: 60px;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
`;

const BookImage = styled.img`
    width: 300px;
    height: 450px;
    object-fit: cover;
    border-radius: 10px;
    background: white;
    border: 2px solid #ccc;
`;

const Details = styled.div`
    flex: 0 0 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
    font-size: 1.4rem;
`;

const BookTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 10px;
`;

const DetailItem = styled.div`
    font-size: 1.2rem;
`;

const RequestButton = styled.button`
    margin-top: 20px;
    padding: 10px 30px;
    font-size: 1.2rem;
    border: 2px solid #000;
    background: #f7dca0;
    cursor: pointer;
    border-radius: 10px;
    width: fit-content;
    align-self: center;
    transition: background-color 0.2s;

    &:hover {
        background: #e6c97e;
    }
`;

const NoData = styled.div`
    text-align: center;
    margin-top: 50px;
    font-size: 1.8rem;
`;

const BookDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<any>(null);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:8080/api/books/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Book not found');
                }
                return res.json();
            })
            .then(data => setBook(data))
            .catch(err => console.error('Error fetching book:', err));
    }, [id]);

    const handleRequestBook = () => {
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) {
            toast.error('You must be logged in to request a book.');
            return;
        }
        const user = JSON.parse(storedUser);

        fetch(`http://localhost:8080/api/book-requests?bookId=${id}&requesterId=${user.id}`, {
            method: 'POST',
        })
            .then(response => {
                if (response.ok) {
                    toast.success('Request created successfully!');
                } else if (response.status === 409) {
                    toast.warning('You already requested this book!');
                } else {
                    toast.error('Error creating request.');
                }
            })
            .catch(error => {
                console.error('Error requesting book:', error);
                toast.error('Error requesting book.');
            });
    };

    if (!book) {
        return (
            <>
                <GlobalStyle />
                <Header toggleMenu={() => setShowMenu(!showMenu)} />
                <Menu open={showMenu} />
                <ToastContainer />
                <PageContainer>
                    <NoData>Loading book details...</NoData>
                </PageContainer>
            </>
        );
    }

    const imageUrl = book.photoPath
        ? `http://localhost:8080/${book.photoPath.replace(/\\/g, '/')}`
        : 'http://localhost:8080/default-book.png';

    return (
        <>
            <GlobalStyle />
            <Header toggleMenu={() => setShowMenu(!showMenu)} />
            <Menu open={showMenu} />
            <ToastContainer />
            <PageContainer>
                <BookDetailsContainer>
                    <BookImage src={imageUrl} alt={book.title || 'Book'} />
                    <Details>
                        <BookTitle>{book.title}</BookTitle>
                        <DetailItem><strong>Author:</strong> {book.author}</DetailItem>
                        <DetailItem><strong>Owner:</strong> {book.owner?.name || 'Unknown'}</DetailItem>
                        <DetailItem><strong>Tags:</strong> {book.tags?.join(', ') || 'None'}</DetailItem>
                        <RequestButton onClick={handleRequestBook}>Request Book</RequestButton>
                    </Details>
                </BookDetailsContainer>
            </PageContainer>
        </>
    );
};

export default BookDetailsPage;
