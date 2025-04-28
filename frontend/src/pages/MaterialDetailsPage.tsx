import React, {JSX, useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Header from "../components/Header";
import Menu from "../components/Menu";
import mammoth from "mammoth";

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

  /* force a “page break” before each top-level heading */
  h1 {
    page-break-before: always;
  }

  /* limit the height and allow scrolling through pages */
  max-height: calc(100vh - 220px);
  overflow-y: auto;
`;


export default function MaterialDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [mat, setMat] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [docHtml, setDocHtml] = useState<string>("");

    useEffect(() => {
        fetch(`http://localhost:8080/api/materials/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Material not found');
                return res.json();
            })
            .then(setMat)
            .catch(e => setError(e.message));
    }, [id]);

    useEffect(() => {
        if (mat) {
            const normalizedPath = mat.path.replace(/\\/g, '/');
            const fileUrl = `http://localhost:8080/${normalizedPath}`;
            const filename = normalizedPath.split('/').pop()!;
            const ext = filename.split('.').pop()!.toLowerCase();

            if (ext === 'docx') {
                fetch(fileUrl)
                    .then(response => response.arrayBuffer())
                    .then(arrayBuffer => mammoth.convertToHtml({ arrayBuffer }))
                    .then(result => {
                        setDocHtml(result.value);
                    })
                    .catch(() => setError('Failed to load DOCX file'));
            }
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
        if (docHtml) {
            viewer = (
                <DocContainer
                    dangerouslySetInnerHTML={{
                        __html: docHtml || '<p>Loading document…</p>'
                    }}
                />
            );
        } else {
            viewer = <p>Loading document...</p>;
        }
    } else {
        viewer = (
            <a href={fileUrl} download={`${mat.name}.${ext}`}>
                Download {mat.name}
            </a>
        );
    }

    return (
        <>
            <GlobalStyle />
            <Header toggleMenu={() => setShowMenu(o => !o)} />
            <Menu open={showMenu} />
            <ViewerWrapper>
                <h1>{mat.name}</h1>
                <p>{mat.description}</p>
                {viewer}
                <BackButton onClick={() => navigate('/materials')}>
                    ← Back to Materials
                </BackButton>
            </ViewerWrapper>
        </>
    );
}


