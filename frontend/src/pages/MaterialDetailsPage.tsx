import React, { JSX, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Header from '../components/Header';
import Menu from '../components/Menu';
import mammoth from 'mammoth';
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from 'react-icons/ti';
import { jwtDecode } from 'jwt-decode';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        font-family: 'Josefin Sans', sans-serif;
        background-color: #fcf6e8;
    }
`;

const ViewerWrapper = styled.div`
    padding: 110px 40px;
    max-width: 900px;
    margin: auto;
`;

const BackButton = styled.button`
    margin-top: 20px;
    background: none;
    border: none;
    color: #1565c0;
    font-size: 1rem;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

const DownloadButton = styled.button`
    margin-top: 20px;
    padding: 10px 16px;
    background-color: #27ae60;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    &:hover {
        background-color: #1e8449;
    }
`;

const DocContainer = styled.div`
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 40px;
    margin: 20px auto;
    max-width: 800px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    line-height: 1.6;
    color: #333;

    h1, h2, h3, h4, h5 {
        margin: 1.2em 0 0.5em;
    }
    p {
        margin: 1em 0;
    }
    ul, ol {
        margin: 1em 0;
        padding-left: 1.5em;
    }

    /* Forțează „page break” înainte de fiecare heading h1 */
    h1 {
        page-break-before: always;
    }

    /* Limitează înălțimea și permite scroll */
    max-height: calc(100vh - 220px);
    overflow-y: auto;
`;

const RatingSection = styled.div`
    margin: 20px 0 10px;
`;

const RatingLabel = styled.div`
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 6px;
`;

const StarsContainer = styled.div`
    display: flex;
    font-size: 2rem;
    align-items: center;
    gap: 4px;
`;

const InteractiveStars = styled.div`
    display: flex;
    font-size: 2.2rem;
    align-items: center;
`;

const StarWrapper = styled.div<{ active: boolean; disabled?: boolean }>`
    cursor: ${props => (props.disabled ? 'default' : 'pointer')};
    color: ${props => (props.active ? '#ffc107' : '#ccc')};
    transition: color 0.1s;
`;

interface JwtPayload {
    id: string;
}

export default function MaterialDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [mat, setMat] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [docHtml, setDocHtml] = useState<string>('');

    const [hoverRating, setHoverRating] = useState<number>(0);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [userRating, setUserRating] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const getUserId = (): string | null => {
        const token = sessionStorage.getItem('token');
        if (!token) return null;
        try {
            return jwtDecode<JwtPayload>(token).id;
        } catch {
            return null;
        }
    };

    const loadMaterial = () => {
        fetch(`http://localhost:8080/api/materials/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Material not found');
                return res.json();
            })
            .then(data => {
                setMat(data);
                setError(null);
            })
            .catch(e => {
                setError(e.message);
                setMat(null);
            });
    };

    useEffect(() => {
        if (id) loadMaterial();
    }, [id]);

    useEffect(() => {
        if (!mat) return;
        const normalizedPath = mat.path.replace(/\\/g, '/');
        const fileUrl = `http://localhost:8080/${normalizedPath}`;
        const filename = normalizedPath.split('/').pop()!;
        const ext = filename.split('.').pop()!.toLowerCase();

        if (ext === 'docx') {
            fetch(fileUrl)
                .then(res => res.arrayBuffer())
                .then(ab => mammoth.convertToHtml({ arrayBuffer: ab }))
                .then(result => setDocHtml(result.value))
                .catch(() => setError('Failed to load DOCX file'));
        }
    }, [mat]);

    useEffect(() => {
        const userId = getUserId();
        if (mat && userId) {
            fetch(`http://localhost:8080/api/ratings/user-rating?userId=${userId}&materialId=${mat.id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Error fetching user rating');
                    return res.json();
                })
                .then((value: number) => {
                    setUserRating(value);
                    setSelectedRating(value);
                })
                .catch(err => console.error('Fetch user-rating error:', err));
        }
    }, [mat]);

    if (error) return <p style={{ padding: 110 }}>Error: {error}</p>;
    if (!mat) return <p style={{ padding: 110 }}>Loading…</p>;

    const normalizedPath = mat.path.replace(/\\/g, '/');
    const fileUrl = `http://localhost:8080/${normalizedPath}`;
    const filename = normalizedPath.split('/').pop()!;
    const ext = filename.split('.').pop()!.toLowerCase();

    let viewer: JSX.Element;
    if (ext === 'pdf') {
        viewer = (
            <iframe
                src={fileUrl}
                width="100%"
                height="800px"
                style={{ border: 'none' }}
            >
                <p>Your browser can’t display PDFs. <a href={fileUrl} download>Download PDF</a>.</p>
            </iframe>
        );
    } else if (['png', 'jpg', 'jpeg'].includes(ext)) {
        viewer = (
            <img
                src={fileUrl}
                alt={mat.name}
                style={{ maxWidth: '100%', borderRadius: 8 }}
            />
        );
    } else if (ext === 'docx') {
        viewer = docHtml
            ? <DocContainer dangerouslySetInnerHTML={{ __html: docHtml }} />
            : <p>Loading document...</p>;
    } else {
        viewer = (
            <a href={fileUrl} download={`${mat.name}.${ext}`}>
                Download {mat.name}
            </a>
        );
    }

    const averageRating = mat.nrRatings > 0 ? mat.rating / mat.nrRatings : 0;
    const renderAverageStars = (rating: number) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.25 && rating % 1 < 0.75;
        const empty = 5 - full - (half ? 1 : 0);
        return (
            <>
                {Array(full).fill(0).map((_, i) => <TiStarFullOutline key={`avg-full-${i}`} />)}
                {half && <TiStarHalfOutline key="avg-half" />}
                {Array(empty).fill(0).map((_, i) => <TiStarOutline key={`avg-empty-${i}`} />)}
            </>
        );
    };

    const handleSubmitRating = (stars: number) => {
        const userId = getUserId();
        if (!userId) {
            setErrorMessage('Trebuie să te loghezi ca să poți vota.');
            return;
        }
        if (userRating > 0) {
            setErrorMessage('Ai votat deja acest material.');
            return;
        }
        setSelectedRating(stars);

        fetch(`http://localhost:8080/api/materials/rating?materialId=${mat.id}&userId=${userId}&rating=${stars}`, {
            method: 'PUT'
        })
            .then(res => {
                if (res.status === 409) throw new Error('Ai votat deja acest material.');
                if (!res.ok) throw new Error('Nu s-a putut trimite rating-ul');
                return res.text();
            })
            .then(() => {
                setUserRating(stars);
                loadMaterial();
                setHoverRating(0);
            })
            .catch(err => {
                setErrorMessage(err.message);
                setHoverRating(0);
            });
    };

    const forceDownload = async () => {
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const tempUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = tempUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(tempUrl);
        } catch (e) {
            console.error('Download error:', e);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Header toggleMenu={() => setShowMenu(v => !v)} />
            <Menu open={showMenu} />

            <ViewerWrapper>
                <h1>{mat.name}</h1>
                <p>{mat.description}</p>

                <RatingSection>
                    <RatingLabel>Average Rating:</RatingLabel>
                    <StarsContainer>
                        {renderAverageStars(averageRating)}
                        <span style={{ marginLeft: '8px', fontSize: '1rem', color: '#555' }}>
              ({mat.nrRatings} review{mat.nrRatings !== 1 ? 's' : ''})
            </span>
                    </StarsContainer>
                </RatingSection>

                {viewer}

                <RatingSection>
                    <RatingLabel>Your Rating:</RatingLabel>

                    {userRating > 0 ? (
                        <StarsContainer>
                            {Array(5).fill(0).map((_, idx) => {
                                const starNumber = idx + 1;
                                return starNumber <= userRating
                                    ? <TiStarFullOutline key={`static-full-${idx}`} color="#ffc107" />
                                    : <TiStarOutline key={`static-empty-${idx}`} color="#ccc" />;
                            })}
                        </StarsContainer>
                    ) : (
                        <InteractiveStars onMouseLeave={() => setHoverRating(0)}>
                            {Array(5).fill(0).map((_, idx) => {
                                const starNumber = idx + 1;
                                const isActive = hoverRating >= starNumber || selectedRating >= starNumber;
                                return (
                                    <StarWrapper
                                        key={`interactive-${idx}`}
                                        active={isActive}
                                        disabled={userRating > 0}
                                        onMouseEnter={() => setHoverRating(starNumber)}
                                        onClick={() => handleSubmitRating(starNumber)}
                                    >
                                        <TiStarFullOutline />
                                    </StarWrapper>
                                );
                            })}
                        </InteractiveStars>
                    )}

                    {errorMessage && (
                        <p style={{ color: 'red', marginTop: '6px' }}>
                            {errorMessage}
                        </p>
                    )}
                </RatingSection>

                <DownloadButton onClick={forceDownload}>
                    Download Material
                </DownloadButton>
            </ViewerWrapper>
        </>
    );
}


