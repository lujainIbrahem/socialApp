# 🚀 Scalable Backend System (Express / MongoDB / Socket.IO / GraphQL)

A production-ready backend system built with Node.js ecosystem implementing authentication, real-time communication, social networking features, and GraphQL API using a clean modular architecture.

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-black?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-black?logo=socketdotio)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?logo=graphql&logoColor=white)

---

## 📌 Overview

This project simulates a real-world social platform backend including authentication, real-time chat, posts, comments, friends system, and GraphQL API.

---

## ⚙️ Tech Stack

Node.js, Express.js, TypeScript, MongoDB, Mongoose, Socket.IO, GraphQL, JWT, bcrypt, Nodemailer, Multer

---

## 🧱 Architecture

src/
│
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
├── utils/
├── middleware/
├── service/
└── main.ts

---

## 🔐 Authentication System

- Sign up / Sign in
- Email OTP verification
- Google OAuth login
- JWT Access & Refresh Tokens
- Logout (single device / all devices)
- Token revocation system

---

## 👤 User System

- Profile management
- Role-based access (user / admin / superAdmin)
- Friend system (mutual relationships)

---

## 📝 Posts System

- Create / update / delete posts
- Like / unlike posts
- Tag users
- Privacy: public / private / friends-only

---

## 💬 Comments System

- Nested comments
- Reply support
- Polymorphic (Post / Comment)
- User tagging

---

## 💬 Real-Time Chat (Socket.IO)

- Private chat (1-to-1)
- Group chat
- Join room system
- Online/offline tracking

Events:
sendMessage
sendGroupMessage
join_room
offline_user

---

## 🤝 Friend System

- Send friend request
- Accept request
- Prevent duplicates
- Mutual friendship creation

---

## 📊 GraphQL API

- User queries
- Create user mutation
- Strong type schema

---

## 📂 File Upload System

- Multer (disk / memory)
- File validation
- Size limits
- Cloud-ready structure

---

## 🔐 Security Highlights

- JWT authentication
- bcrypt password hashing
- Token blacklist system
- Role-based access control
- Protected routes
- Input validation middleware

---

## 📦 Installation

git clone https://github.com/your-repo.git  
cd project  
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

### Auth
POST /auth/signUp  
POST /auth/signIn  
POST /auth/logout  
POST /auth/refreshToken  
POST /auth/google  

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

### Friends
POST /friend/:userId  
POST /friend/accept/:requestId  

---

## 🚀 Highlights

- Modular architecture
- Real-time system with Socket.IO
- REST + GraphQL hybrid API
- Scalable backend design
- Secure authentication flow
- Social networking features
- Reusable repository pattern

---

## 🔮 Future Improvements

- Swagger documentation
- Docker support
- Unit testing
- Redis caching
- CI/CD pipeline
- Admin dashboard
- Microservices architecture

---

## 👩‍💻 Author

Lujain Ibrahim  
GitHub: https://github.com/lujainIbrahem  

---

## 📄 License

For educational and portfolio purposes only.
