# Chat Application Deployment Guide

## Overview

The project supports three operation modes with different MongoDB configurations:

1. **Local Development WITHOUT Docker** - MongoDB on localhost
2. **Development with Docker** - MongoDB in Docker container
3. **Production** - MongoDB Atlas (cloud database)

---

## 📁 Environment Files Structure

### `.env` - Local Development (WITHOUT Docker)
Used for local execution via `npm run dev`
```bash
ENV=DEV
MONGO_URL='mongodb://localhost:27017/chat'
```

### `.env.dev` - Development with Docker
Used in docker-compose for dev environment
```bash
ENV=DEV
MONGO_URL='mongodb://mongodb:27017/chat'
```
**Note:** `mongodb` is the service name in docker-compose

### `.env.prod` - Production
Used for production with MongoDB Atlas
```bash
ENV=PROD
MONGO_URL='mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/'
```

---

## 🚀 Deployment Scenarios

### 1️⃣ Local Development WITHOUT Docker

**When to use:** Quick development, debugging

**Requirements:**
- MongoDB installed and running locally
- Node.js installed

**Steps:**
```bash
# In be-chat folder
npm install
npm run dev
```

**MongoDB:** Must be running locally on `localhost:27017`

---

### 2️⃣ Development with Docker (local MongoDB)

**When to use:** Testing in production-like environment, team collaboration

**Requirements:**
- Docker and Docker Compose

**Steps:**
```bash
# In fe-chat folder
docker-compose up

# OR explicitly specify file
docker-compose -f docker-compose.yml up

# OR using dev file
docker-compose -f docker-compose.dev.yml up
```

**What runs:**
- ✅ MongoDB container (local database)
- ✅ Backend (Node.js API)
- ✅ Frontend (Angular)

**Ports:**
- Frontend: http://localhost:4202
- Backend: http://localhost:3000
- MongoDB: localhost:27017

---

### 3️⃣ Production (MongoDB Atlas)

**When to use:** Deployment on production server

**Requirements:**
- Docker and Docker Compose
- MongoDB Atlas account

**Steps:**
```bash
# In fe-chat folder
docker-compose -f docker-compose.prod.yml up -d
```

**What runs:**
- ❌ No MongoDB (uses Atlas)
- ✅ Backend (connects to MongoDB Atlas)
- ✅ Frontend

**IMPORTANT:** Verify that `.env.prod` has the correct `MONGO_URL` pointing to your Atlas cluster!

---

## 🔄 Switching Between Modes

### Development → Production
```bash
# Stop dev
docker-compose down

# Start prod
docker-compose -f docker-compose.prod.yml up -d
```

### Production → Development
```bash
# Stop prod
docker-compose -f docker-compose.prod.yml down

# Start dev
docker-compose up -d
```

---

## 🗄️ Working with MongoDB

### Clear local database (dev)
```bash
cd be-chat
npm run clearDB
```

### Connect to MongoDB container
```bash
docker exec -it chat-mongodb mongosh
```

### Backup MongoDB (dev)
```bash
docker exec chat-mongodb mongodump --out=/data/backup
```

---

## 📝 Useful Commands

### Check container status
```bash
docker-compose ps
```

### View logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# MongoDB only
docker-compose logs -f mongodb
```

### Restart specific service
```bash
docker-compose restart backend
```

### Stop and remove all containers + volumes
```bash
docker-compose down -v
```

---

## ⚠️ Troubleshooting

### MongoDB connection refused
**Problem:** Backend cannot connect to MongoDB

**Solution:**
- Check that MongoDB container is running: `docker ps`
- Verify `.env.dev` uses `mongodb://mongodb:27017/chat`
- Verify that backend depends_on mongodb in docker-compose

### Port already in use
**Problem:** Port 3000 or 27017 is occupied

**Solution:**
```bash
# Find process
netstat -ano | findstr :3000
# OR for MongoDB
netstat -ano | findstr :27017

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Backend doesn't see .env variables
**Problem:** `MONGO_URL is undefined`

**Solution:**
- Check that `env_file` points to correct path in docker-compose
- Rebuild container: `docker-compose up --build`

---

## 📦 .gitignore

**DO NOT** add to git:
```
.env
.env.prod
.env.dev
```

**DO ADD** to git:
```
.env.example
```

---

## 🎯 Quick Start for New Developers

1. Clone repository
2. Copy `.env.example` → `.env`
3. Install dependencies: `cd be-chat && npm install`
4. Run with Docker: `cd ../fe-chat && docker-compose up`
5. Open http://localhost:4202

---

## 📞 Contact

Author: Andrew Yupin
