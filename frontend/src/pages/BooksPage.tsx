import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import BeeIcon from '../assets/Logo_cropped.png';
import BeeText from '../assets/LogoText.png';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

// ✅ Funcție debounce
function debounce(func: (...args: any[]) => void, delay: number) {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

// ✅ Global Styles
const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');
    body {
        margin: 0;
        padding: 0;
        font-family: 'Josefin Sans', sans-serif;
        background-color: #fcf6e8;
    }
`;

// ✅ Styled Components
const Header = styled.div`
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
`;

const LogoImage = styled.img`
    height: 50px;
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

const Sidebar = styled.div<{ open: boolean }>`
    width: 250px;
    background: #f7dca0;
    height: calc(100vh - 70px);
    border-left: 2px solid #000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top: 102px;
    right: ${props => (props.open ? '0' : '-250px')};
    transition: right 0.3s ease-in-out;
    z-index: 1000;
`;

const MenuItems = styled.div`
    display: flex;
    flex-direction: column;
    padding: 30px 20px;
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
    margin-bottom: 40px;
`;

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
`;

const NoResults = styled.div`
    text-align: center;
    font-size: 1.5rem;
    margin-top: 50px;
    color: #666;
`;

// ✅ Componenta principală
const BooksPage: React.FC = () => {
    const navigate = useNavigate();
    const [allBooks, setAllBooks] = useState<any[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8080/api/books')
            .then(res => res.json())
            .then(data => {
                setAllBooks(data);
                setFilteredBooks(data);
            })
            .catch(err => console.error("Eroare la cărți:", err));
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
            <Header>
                <LogoContainer>
                    <LogoImage src={BeeIcon} />
                    <LogoImage src={BeeText} />
                </LogoContainer>
                <MenuButton onClick={() => setShowMenu(!showMenu)}>Menu</MenuButton>
            </Header>

            <Sidebar open={showMenu}>
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

            <Container>
                <Toolbar>
                    <Title>Books</Title>
                    <SearchBar>
                        <FiSearch />
                        <SearchInput
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                debouncedSearch(e.target.value);
                            }}
                        />
                    </SearchBar>
                    <TagFilter
                        value={selectedTag}
                        onChange={(e) => handleFilterChange(e.target.value)}
                    >
                        <option value="">Tags</option>
                        <option value="LAW">Law</option>
                        <option value="COMPUTER_SCIENCE">Computer Science</option>
                        <option value="MEDICINE">Medicine</option>
                        <option value="BIOLOGY">Biology</option>
                        <option value="HISTORY">History</option>
                    </TagFilter>
                </Toolbar>
                <Underline />

                {filteredBooks.length > 0 ? (
                    <BookGrid>
                        {filteredBooks.map((book, index) => (
                            <BookCard key={index}>
                                <BookImage
                                    src={`http://localhost:8080/${book.photoPath.replace(/\\/g, '/')}`}
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
        </>
    );
};

export default BooksPage;
