# Agri-Smart Deployment Guide

This guide provides instructions for deploying the Agri-Smart application to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Docker Deployment](#docker-deployment)
- [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
- [Render Deployment (Backend)](#render-deployment-backend)
- [Manual Deployment](#manual-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (for production database)
- Git account (GitHub, GitLab, or Bitbucket)
- Docker and Docker Compose (for Docker deployment)

## Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your production values:
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agri-smart?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
WEATHER_API_BASE_URL=https://api.open-meteo.com/v1
ML_SERVICE_URL=http://localhost:5001
CORS_ORIGIN=https://your-frontend-domain.com
```

**Important:** Never commit the `.env` file to version control. It's already included in `.gitignore`.

## Docker Deployment

Docker is the recommended deployment method as it provides consistent environments across development and production.

### Quick Start with Docker Compose

1. Build and start all services:
```bash
docker-compose up -d --build
```

2. Check the status:
```bash
docker-compose ps
```

3. View logs:
```bash
docker-compose logs -f
```

4. Stop services:
```bash
docker-compose down
```

### Manual Docker Deployment

#### Backend

1. Build the backend image:
```bash
docker build -t agri-smart-backend .
```

2. Run the container:
```bash
docker run -d \
  --name agri-smart-backend \
  -p 3000:3000 \
  --env-file .env \
  agri-smart-backend
```

#### Frontend

1. Build the frontend image:
```bash
cd frontend
docker build -t agri-smart-frontend .
```

2. Run the container:
```bash
docker run -d \
  --name agri-smart-frontend \
  -p 80:80 \
  agri-smart-frontend
```

### Docker Compose Production

For production, update the `docker-compose.yml` with your production environment variables and run:

```bash
docker-compose -f docker-compose.yml up -d
```

## Vercel Deployment (Frontend)

Vercel is recommended for deploying the React frontend.

### Step 1: Prepare Frontend

1. Update the frontend's API base URL in production:
   - In `frontend/src/components`, update all API calls to use your production backend URL
   - Or use environment variables with Vercel

2. Create a `vercel.json` file in the frontend directory:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Step 2: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Import your repository
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables if needed
6. Click "Deploy"

### Step 3: Configure Environment Variables

In Vercel dashboard, add environment variables:
- `VITE_API_URL`: Your production backend URL

## Render Deployment (Backend)

Render is a good option for deploying the Node.js backend.

### Step 1: Prepare Backend

1. Ensure your backend has CORS configured for your frontend domain
2. Update the `package.json` start script if needed

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** agri-smart-backend
   - **Region:** Choose nearest to your users
   - **Branch:** main
   - **Root Directory:** `.` (root)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variables (copy from your `.env` file)
6. Click "Create Web Service"

### Step 3: Configure MongoDB

1. Create a MongoDB Atlas cluster if you haven't already
2. Whitelist Render's IP addresses in MongoDB Atlas
3. Update the `MONGODB_URI` in Render environment variables

## Manual Deployment

### Backend Deployment (VPS/Cloud Server)

1. SSH into your server
2. Install Node.js and MongoDB:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb
```

3. Clone your repository:
```bash
git clone https://github.com/yourusername/agri-smart.git
cd agri-smart
```

4. Install dependencies:
```bash
npm install --production
```

5. Set up environment:
```bash
cp .env.example .env
nano .env
# Update with your production values
```

6. Start the application with PM2 (process manager):
```bash
npm install -g pm2
pm2 start server.js --name agri-smart-backend
pm2 save
pm2 startup
```

7. Set up Nginx reverse proxy (optional but recommended):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Frontend Deployment (VPS/Cloud Server)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Serve with Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/agri-smart/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
    }
}
```

3. Restart Nginx:
```bash
sudo systemctl restart nginx
```

## Troubleshooting

### Backend Issues

**Database Connection Failed:**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure MongoDB cluster is running

**CORS Errors:**
- Update `CORS_ORIGIN` in `.env` to match your frontend domain
- Restart the backend after changes

**Port Already in Use:**
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

### Frontend Issues

**API Calls Failing:**
- Check that backend URL is correct in production
- Verify CORS is configured on backend
- Check browser console for specific errors

**Build Fails:**
- Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

**Container Won't Start:**
```bash
# Check logs
docker logs <container-name>
# Rebuild without cache
docker-compose build --no-cache
```

**Network Issues:**
```bash
# Check network
docker network ls
# Recreate network
docker-compose down
docker-compose up -d
```

## Security Best Practices

1. **Never commit `.env` file** - Use `.env.example` as template
2. **Use strong JWT secrets** - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **Enable HTTPS** - Use Let's Encrypt with Certbot
4. **Rate limiting** - Implement rate limiting on API endpoints
5. **Input validation** - Validate all user inputs
6. **Regular updates** - Keep dependencies updated
7. **Backup database** - Set up automated MongoDB backups

## Monitoring

### Backend Monitoring

- Use PM2 for process monitoring:
```bash
pm2 monit
pm2 logs
```

- Set up health check endpoint: `http://your-domain.com/health`

### Frontend Monitoring

- Use Vercel Analytics (if deployed on Vercel)
- Set up error tracking with Sentry

## Scaling

### Horizontal Scaling

For high traffic, consider:
- Load balancer (Nginx, HAProxy)
- Multiple backend instances
- Redis for session management
- CDN for static assets

### Database Scaling

- Use MongoDB Atlas for automatic scaling
- Implement database indexing
- Consider read replicas for read-heavy operations

## Support

For issues or questions:
- Check GitHub Issues
- Review logs in `/var/log/pm2/` (PM2 logs)
- Check Docker logs: `docker-compose logs -f`
