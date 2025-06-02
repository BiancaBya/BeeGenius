# 🐝 BeeGenius

**BeeGenius** is a team project developed by Bianca Pulpa, Alexandra Puscas and Bogdan Rebeles, which consists of a full-stack web application designed for managing and distributing educational resources with the explicit aim of supporting SDG 4: Quality Education by making high-quality learning content accessible and well-organized. Built with **Java + Spring Boot** on the backend and **React + TypeScript** on the frontend, BeeGenius provides role-based access control with secure JWT authentication, comprehensive dashboards for browsing and searching Materials and Books, intuitive forms for creating content, as well as drag-and-drop file uploads and real-time filtering. Users can preview images and documents in-app, and download files with a single click. All client–server communication is handled via REST APIs.

---

## 📌 Key Features

### 🔐 Authentication & Authorization
- **JWT‐based login & sign‐up** flow  
- Dedicated **registration** page for new users  
- **Protected routes** for pages that require login 

### 🗂️ Posts 
- **List all posts**: Displays a list of posts with title, author and content 
- **View post details**: Shows full content of a selected post  
- **Create a new post**: Form with fields for title and text
- **Delete post**: Remove one of your posts 
- **Add comment**: Users can submit comments on a post  
- **Reply to comment**: Nested replies under existing comments  
- **Validation**: Frontend form validation (required fields, character limits) and backend validation

### 📚 Materials 
- **List all materials**: Displays available materials with name, description, file type and tags  
- **Material details**: View full description and download link for the uploaded file  
- **Upload new material**:
  - Form with fields: **Name**, **Description**, **File** (PDF, DOCX, PNG, JPG, etc.), and **Tags** (multi-select)
  - Associates uploaded file with a user (uploader) via JWT  
- **Edit / Delete material**: Options to update metadata or remove the file  
- **Filter**: Materials can be filtered by one or more tags
- **Sreahc**: The user can search a material by title

### 📖 Books 
- **List all books**: Shows thumbnails, title and author
- **Book details page**: Displays full information
- **Add new book**:
  - Form with fields: **Title**, **Author**, **Cover Image** 
  - Validates required fields before allowing submission  
- **Delete book**: Manage existing book entries from a protected interface  
- **Search & Filter**: Clients can search books by title or author

---

## ⚙️ Technologies Used

- ### Backend
  - **Java & Spring Boot**: REST API endpoints, business logic, and application configuration  
  - **Spring Data JPA (Hibernate)**: ORM layer for mapping Java entities to relational database tables  
  - **Lombok**: Reduces boilerplate (getters, setters, constructors) via annotations  
  - **Spring Security + JWT**: Secures endpoints, issues and validates JSON Web Tokens  
  - **PostgreSQL** : Persistent storage of users, posts, materials, books, tags, etc.  
  - **Spring Web MVC**: Controller layer exposing RESTful endpoints  
  - **Gradle**: Build automation and dependency management  
  - **OpenAI API Token**: Powers the AI chat assistant feature, enabling users to interact with the in-app AI agent  

- ### Frontend
  - **React** + **TypeScript**: Component‐driven UI, type safety and client‐side logic  
  - **Styled‐Components**: CSS‐in‐JS for modular, scoped styling  
  - **React Router**: Client‐side routing to navigate between pages  
  - **Fetch**: HTTP client for communicating with the backend REST APIs  
  - **JWT Storage**: `sessionStorage` to hold the JWT token during user session  
  - **React Hooks**: `useState`, `useEffect`, custom hooks for authentication and data fetching  
  - **npm**: Package management  

---

## 🌐 Architecture Overview

### Backend Layers
1. **Model**: Contains the core entities such as User, Post, Material or Book.

2. **Repository Layer**  
   - Spring Data JPA interfaces (e.g., `UserRepository`, `PostRepository`, `MaterialRepository`, `BookRepository`)  
   - CRUD methods plus custom queries (e.g., find posts by keyword, find materials by tag)

3. **Service Layer**  
   - **UserService**: Handles registration, login (password hashing), token generation, and user profile updates  
   - **PostService**: Business logic for creating and retrieving posts  
   - **MaterialService**: Manages file uploads, tag associations and CRUD operations  
   - **BookService**: Cover image handling and CRUD operations for book entities  
   - **TagService**: Provides list of available tags

4. **Controller Layer**  
   - **AuthController**: Exposes `/api/auth/login` and `/api/auth/signup` endpoints  
   - **PostController**: `/api/posts` endpoints 
   - **MaterialController**: `/api/materials` endpoints, including file‐upload handling 
   - **BookController**: `/api/books` endpoints, including cover image 
   - **TagController**: `/api/tags` endpoint for listing tags  

5. **Security Configuration**  
   - **JWTFilter**: Intercepts incoming requests, extracts and validates JWT from `Authorization` header  
   - **WebSecurityConfig**: Configures protected routes (e.g., `/api/posts/**` requires authenticated user), open routes (e.g., `/api/auth/**`), password encoding, CORS, and CSRF settings  

### Frontend Structure

- **Routing**: Uses `react-router-dom` to define routes for each page.  
- **Auth Context**: Provides `AuthProvider` to supply `user`, `token`, `login()`, `logout()` functions via React Context.  
- **HTTP Client**: Each service wrapper uses `fetch` to call backend endpoints.  
- **File Uploads**: On AddMaterialPage.tsx and AddBookPage.tsx, `FormData` is used to send requests to Spring Boot.  

---


