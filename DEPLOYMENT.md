# Deployment Guide - Salary Sheet Management System

This guide covers deploying the Salary Management System to various platforms.

---

## 🚀 Deployment Options

1. **Vercel (Frontend) + Railway/Render (Backend)** - Recommended for beginners
2. **Heroku** - All-in-one platform
3. **AWS (EC2, RDS, S3)** - Enterprise solution
4. **DigitalOcean/Linode VPS** - Full control
5. **Docker + Docker Compose** - Containerized deployment

---

## 📦 Option 1: Vercel + Railway (Recommended)

### **Step 1: Deploy Backend to Railway**

1. **Create Railway Account:** https://railway.app/
2. **Create New Project** → "Deploy from GitHub repo"
3. **Connect GitHub repository**
4. **Configure:**
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Build Command: `npm install`

5. **Add Environment Variables:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_ACCESS_SECRET=<generate-32-char-secret>
JWT_REFRESH_SECRET=<generate-32-char-secret>
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
```

6. **Deploy** and note the deployed URL (e.g., `https://salary-api.railway.app`)

### **Step 2: Deploy Frontend to Vercel**

1. **Create Vercel Account:** https://vercel.com/
2. **Import Project** from GitHub
3. **Configure:**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variable:**
```
VITE_API_URL=https://salary-api.railway.app/api
```

5. **Deploy**

**Your app is live! 🎉**

---

## 📦 Option 2: Heroku (All-in-One)

### **Prerequisites**
- Heroku account
- Heroku CLI installed

### **Deploy Backend**

```bash
# Login to Heroku
heroku login

# Create app
heroku create salary-backend

# Add MongoDB add-on
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_ACCESS_SECRET=your-secret
heroku config:set JWT_REFRESH_SECRET=your-secret

# Deploy
git subtree push --prefix backend heroku main

# Or create separate repo for backend
cd backend
git init
heroku git:remote -a salary-backend
git add .
git commit -m "Deploy"
git push heroku main
```

### **Deploy Frontend**

```bash
# Create frontend app
heroku create salary-frontend

# Set API URL
heroku config:set VITE_API_URL=https://salary-backend.herokuapp.com/api

# Deploy
git subtree push --prefix frontend heroku main
```

---

## 🐳 Option 3: Docker Deployment

### **Create Dockerfiles**

**Backend Dockerfile (`backend/Dockerfile`):**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

**Frontend Dockerfile (`frontend/Dockerfile`):**

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Frontend nginx.conf (`frontend/nginx.conf`):**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**docker-compose.yml (root):**

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    container_name: salary-mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    container_name: salary-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/salary_management?authSource=admin
      - JWT_ACCESS_SECRET=your-secret-key-change-in-production
      - JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: salary-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

**Deploy with Docker:**

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## ☁️ Option 4: AWS Deployment

### **Architecture:**
- **EC2** - Backend server
- **S3 + CloudFront** - Frontend static files
- **MongoDB Atlas** or **DocumentDB** - Database
- **Route 53** - DNS
- **Certificate Manager** - SSL

### **Steps:**

1. **Launch EC2 Instance (Ubuntu 22.04)**
2. **Install Node.js and PM2:**

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone project
git clone <repo-url>
cd salary-sheet-management-system/backend

# Install dependencies
npm install

# Create .env file
nano .env
# (Add production environment variables)

# Start with PM2
pm2 start src/server.js --name salary-api
pm2 startup
pm2 save
```

3. **Configure Nginx as Reverse Proxy:**

```bash
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/salary-api

# Add:
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/salary-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **SSL with Let's Encrypt:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

5. **Deploy Frontend to S3:**

```bash
# Build frontend locally
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Configure CloudFront for CDN
# Update VITE_API_URL to point to your EC2/domain
```

---

## 🖥️ Option 5: VPS (DigitalOcean/Linode)

Similar to AWS EC2 deployment, but simpler:

1. **Create Droplet** (Ubuntu 22.04, 2GB RAM minimum)
2. **Install dependencies** (Node.js, MongoDB, Nginx)
3. **Clone and configure** project
4. **Use PM2** for process management
5. **Configure Nginx** as reverse proxy
6. **Add SSL** with Certbot

**Quick Setup Script:**

```bash
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

echo "Setup complete! Clone your project and configure."
```

---

## 🔒 Security Best Practices

### **1. Environment Variables**
- Never commit `.env` files
- Use strong, random secrets (32+ characters)
- Different secrets for dev/prod

### **2. Database Security**
- Enable authentication
- Whitelist IP addresses
- Use strong passwords
- Regular backups

### **3. API Security**
- Rate limiting
- CORS configuration
- Input validation
- SQL injection prevention (using Mongoose)

### **4. HTTPS/SSL**
- Always use HTTPS in production
- Free SSL with Let's Encrypt
- Force HTTPS redirects

### **5. Server Hardening**
- Firewall configuration (ufw)
- SSH key authentication only
- Disable root login
- Regular updates

---

## 📊 Monitoring & Maintenance

### **Backend Monitoring (PM2)**

```bash
# View status
pm2 status

# View logs
pm2 logs salary-api

# Monitor resources
pm2 monit

# Restart on file changes
pm2 restart salary-api --watch
```

### **Database Backups (MongoDB)**

```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/salary_management" --out=/backup/

# Restore backup
mongorestore --uri="mongodb://localhost:27017" /backup/salary_management
```

### **Log Management**

```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application logs
pm2 logs salary-api --lines 100
```

---

## 🔄 CI/CD (Optional)

### **GitHub Actions Workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Backend
        run: |
          # Add your deployment commands
          ssh user@server 'cd /app && git pull && pm2 restart all'
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          # Upload to S3 or deploy to Vercel
```

---

## ✅ Post-Deployment Checklist

- [ ] Application is accessible via HTTPS
- [ ] Database is secured and backed up
- [ ] Environment variables are set correctly
- [ ] SSL certificate is valid
- [ ] Monitoring is configured
- [ ] Error logging is working
- [ ] Admin account created
- [ ] Test all core features
- [ ] Performance optimization done
- [ ] SEO meta tags added (if needed)

---

**Deployment complete! Your Salary Management System is live! 🎉**

For issues or questions, refer to troubleshooting section in README.md
