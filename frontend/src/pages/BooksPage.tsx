import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { FiSearch } from 'react-icons/fi';
import { getTagColor } from '../utils/tagColorGenerator';

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');
    body {
        margin: 0;
        padding: 0;
        font-family: 'Josefin Sans', sans-serif;
        background-color: #fcf6e8;
    }
`;

function debounce(func: (...args: any[]) => void, delay: number) {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

const Container = styled.div`
    padding: 120px 40px;
`;

const Toolbar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 10px;
    flex-wrap: wrap;
`;

const Title = styled.h2`
    font-size: 2rem;
    margin: 0;
    white-space: nowrap;
`;

const SearchBar = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-radius: 10px;
    background-color: white;
    border: 1px solid #ccc;
    flex: 1;
    max-width: 500px;
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    font-size: 1rem;
    background: transparent;
    margin-left: 8px;
    width: 100%;
`;

const TagFilter = styled.select`
    padding: 10px;
    font-size: 1rem;
    border-radius: 10px;
    border: 1px solid #ccc;
    background-color: white;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='0,0 14,0 7,7' fill='%23666'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 10px;
    min-width: 200px;
`;

const Underline = styled.div`
    height: 2px;
    width: 100%;
    background-color: black;
    margin: 10px 0 30px;
`;

const BookGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 30px;
`;

const BookCard = styled.div`
    background: #d5d0c4;
    padding: 20px;
    border-radius: 15px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.05);
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

const BookPoster = styled.div`
    font-size: 0.85rem;
    color: #444;
    margin-top: 6px;
`;

const NoResults = styled.div`
    text-align: center;
    font-size: 1.5rem;
    margin-top: 50px;
    color: #666;
`;

const Tag = styled.span<{ color: string }>`
  background: ${props => props.color};
  color: white;
  border-radius: 15px;
  padding: 4px 12px;
  font-size: 0.9rem;
  font-weight: 600;
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
    z-index: ${props => (props.open ? 999 : 1000)};
    transition: all 0.2s ease;

    &:hover {
        background-color: #e6b800;
    }
`;

const Description = styled.div`
    margin-top: 8px;
    font-size: 0.95rem;
    color: #222;
    line-height: 1.4;
`;

interface Book {
    id: string;
    title: string;
    author: string;
    photoPath: string;
    owner?: { name: string };
    tags?: string[];
}

const BooksPage: React.FC = () => {
    const navigate = useNavigate();
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetch('http://localhost:8080/api/books', { headers })
            .then(res => res.json())
            .then(data => {
                setAllBooks(data);
                setFilteredBooks(data);
            })
            .catch(err => console.error('Eroare la cărți:', err));

        fetch('http://localhost:8080/api/tags', { headers })
            .then(res => {
                if (!res.ok) throw new Error('Failed to load tags');
                return res.json();
            })
            .then((data: string[]) => {
                setAvailableTags(data);
            })
            .catch(err => console.error('Error loading tags:', err));
    }, []);

    const applyFilters = (search: string, tag: string) => {
        let filtered = allBooks;
        if (search) {
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (tag) {
            filtered = filtered.filter(book =>
                book.tags?.includes(tag)
            );
        }
        setFilteredBooks(filtered);
    };

    const debouncedSearch = debounce((value: string) => {
        applyFilters(value, selectedTag);
    }, 300);

    const handleFilterChange = (tag: string) => {
        setSelectedTag(tag);
        applyFilters(searchTerm, tag);
    };

    return (
        <>
            <GlobalStyle />
            <Header toggleMenu={() => setShowMenu(v => !v)} />
            <Menu open={showMenu} />
            <Container>
                <Toolbar>
                    <Title>Books</Title>
                    <SearchBar>
                        <FiSearch />
                        <SearchInput
                            placeholder="Search"
                            value={searchTerm}
                            onChange={e => {
                                setSearchTerm(e.target.value);
                                debouncedSearch(e.target.value);
                            }}
                        />
                    </SearchBar>
                    <TagFilter
                        value={selectedTag}
                        onChange={e => handleFilterChange(e.target.value)}
                    >
                        <option value="">Tags</option>
                        {availableTags.map(tag => (
                            <option key={tag} value={tag}>
                                {tag.replace('_', ' ')}
                            </option>
                        ))}
                    </TagFilter>
                </Toolbar>
                <Underline />

                <Description style={{ fontSize: '1.1rem', background: '#f4f0e5', padding: '20px', borderRadius: '12px', margin: '20px 0 40px' }}> 📚✨ Here, members of our community can <strong>donate books</strong> they no longer need and <strong>request books</strong> they’d love to read.

                    Whether you have educational materials to share or you're looking for your next great read, this is the perfect place to <strong>give and receive knowledge</strong>. Click on any book to learn more and make a request! 🤝📖</Description>
                {filteredBooks.length > 0 ? (
                    <BookGrid>
                        {filteredBooks.map((book, index) => (
                            <BookCard key={index} onClick={() => navigate(`/books/${book.id}`)}>
                                <BookImage
                                    src={
                                        book.photoPath
                                            ? `http://localhost:8080/${book.photoPath.replace(/\\/g, '/')}`
                                            : ''
                                    }
                                    alt={book.title}
                                />
                                <BookTitle>{book.title}</BookTitle>
                                <BookAuthor>{book.author}</BookAuthor>
                                <BookPoster>Posted by {book.owner?.name || 'Unknown'}</BookPoster>

                            </BookCard>
                        ))}
                    </BookGrid>
                ) : (
                    <NoResults>📚 No books found.</NoResults>
                )}
            </Container>
            <FloatingButton open={showMenu} onClick={() => navigate('/add-book')}>
                Add Book
            </FloatingButton>
        </>
    );
};

export default BooksPage;
