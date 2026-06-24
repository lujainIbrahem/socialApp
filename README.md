# 🚀 SocialApp Backend System

A scalable and production-ready backend system built with Node.js, Express, MongoDB, Socket.IO, and GraphQL.  
The system simulates a real-world social media platform including authentication, posts, comments, friends system, real-time chat, and GraphQL API.

---

## 🔗 Links

GitHub Repository: https://github.com/lujainIbrahem/socialApp  
Postman API Documentation: https://documenter.getpostman.com/view/44975525/2sB3HhrMpK  

---

## ⚙️ Tech Stack

Node.js, Express.js, TypeScript, MongoDB, Mongoose, Socket.IO, GraphQL, JWT, bcrypt, Nodemailer, Multer

---

## 📌 Features

### 🔐 Authentication System
- User registration and login
- Google OAuth authentication
- JWT Access & Refresh Tokens
- Logout (single device / all devices)
- Token revocation system
- Role-Based Access Control (User / Admin / SuperAdmin)

### 👤 User System
- User profile management
- Update profile data
- Friend request system (send / accept / reject)
- Prevent duplicate friendships

### 📝 Posts System
- Create, update, delete posts
- Like and unlike posts
- Tag users in posts
- Privacy settings (public / private / friends only)

### 💬 Comments System
- Nested comments structure
- Reply to comments
- Polymorphic relation (Post / Comment)
- User tagging in comments

### ⚡ Real-Time Chat (Socket.IO)
- Private chat (1-to-1 messaging)
- Group chat system
- Join room functionality
- Online / offline user tracking

Events:
sendMessage
sendGroupMessage
join_room
offline_user

### 📊 GraphQL API
- User queries
- User creation mutation
- Strong schema typing
- Hybrid REST + GraphQL structure

### 📁 File Upload System
- Multer for file handling (disk & memory)
- File validation and size limits
- Cloud-ready structure (Cloudinary support)

---

## 🔐 Security Features

- JWT Authentication
- bcrypt password hashing
- Token blacklist (revocation system)
- Role-based authorization (RBAC)
- Input validation middleware
- Protected routes

---

## 🧱 Project Architecture

src/
├── DB/
│   ├── models/
│   ├── repositories/
│
├── modules/
│   ├── user/
│   ├── post/
│   ├── comment/
│   ├── chat/
│   ├── gateway/
│
├── graphql/
├── middleware/
├── utils/
├── service/
└── main.ts

---

## 📦 Installation

git clone https://github.com/lujainIbrahem/socialApp.git  
cd socialApp  
npm install  
npm run start:dev  

---

## ⚙️ Environment Variables

PORT=  
MONGO_URL=  

ACCESS_TOKEN_USER=  
ACCESS_TOKEN_ADMIN=  
REFRESH_TOKEN_USER=  
REFRESH_TOKEN_ADMIN=  

EMAIL=  
PASS=  

CLOUD_NAME=  
API_KEY=  
API_SECRET=  

WEB_CLIENT_ID=  

---

## 📌 API Endpoints

### Authentication
POST /auth/signUp  
POST /auth/signIn  
POST /auth/google  
POST /auth/logout  
POST /auth/refreshToken  

### Users
GET /users/profile  
PATCH /users/updateProfile  

### Posts
POST /posts  
GET /posts  
GET /posts/:id  
PATCH /posts/:id  
DELETE /posts/:id  

### Chat
GET /chat/:userId  
POST /chat/group  
GET /chat/group/:groupId  

---

## 🚀 Project Highlights

- Modular scalable architecture
- Real-time communication using Socket.IO
- Hybrid REST + GraphQL API
- Secure authentication flow
- Clean repository pattern
- Production-ready backend structure

---

## 🔮 Future Improvements

- Swagger API documentation
- Docker containerization
- Unit & integration testing
- Redis caching system
- CI/CD pipeline
- Admin dashboard
- Microservices architecture

---

## 👩‍💻 Author

Lujain Ibrahim  
GitHub: https://github.com/lujainIbrahem  

---

## 📄 License

This project is for educational and portfolio purposes only.