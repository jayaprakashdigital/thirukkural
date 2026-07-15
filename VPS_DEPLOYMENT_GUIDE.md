# 🚀 Thirukkural Studio - VPS Deployment Guide

## Server Details
- **IP:** 187.127.165.149
- **OS:** Ubuntu 24.04
- **Existing Folder:** `/home/jp-ai-content-studios`
- **Current Container:** http://187.127.165.149:3500/

---

## ⚠️ SECURITY FIRST

**DO NOT:**
- Share your root password with anyone
- Store credentials in code or config files
- Expose your webhook to the public without verification

**DO:**
- Use SSH keys for authentication
- Use secrets for webhook verification
- Keep your VPS updated with security patches

---

## Step 1️⃣: Connect to Your VPS via SSH

### On your local machine (PowerShell):

```powershell
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096 -f $env:USERPROFILE\.ssh\thirukkural_vps

# Copy public key to VPS (you'll need password once)
type $env:USERPROFILE\.ssh\thirukkural_vps.pub | ssh root@187.127.165.149 "cat >> ~/.ssh/authorized_keys"

# Test SSH connection (should not ask for password)
ssh -i $env:USERPROFILE\.ssh\thirukkural_vps root@187.127.165.149
```

---

## Step 2️⃣: Clone Repository on VPS

Once connected to VPS via SSH, run these commands:

```bash
# Go to existing folder
cd /home/jp-ai-content-studios

# Clone the repository (or update if it exists)
if [ -d "thirukkural" ]; then
    cd thirukkural
    git pull origin master
else
    git clone https://github.com/jayaprakashdigital/thirukkural.git
    cd thirukkural
fi

# Verify files are there
ls -la
```

---

## Step 3️⃣: Set Up Automatic Deployment with Webhook

### Option A: Using Node.js Webhook Server (Recommended)

#### 3A-1: Install Node.js on VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### 3A-2: Set Up Webhook Service

```bash
# Go to repository
cd /home/jp-ai-content-studios/thirukkural

# Copy webhook script
# (Upload the deploy-webhook.js file from your local machine)

# Install dependencies
npm install express crypto

# Test the webhook server
node deploy-webhook.js
```

#### 3A-3: Run Webhook as a Service (PM2)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start webhook with PM2
pm2 start deploy-webhook.js --name "thirukkural-webhook"

# Make it auto-start on reboot
pm2 startup
pm2 save

# Check status
pm2 list
pm2 logs thirukkural-webhook
```

---

### Option B: Using Simple Bash Script

Create a file: `/home/jp-ai-content-studios/deploy.sh`

```bash
#!/bin/bash

REPO_PATH="/home/jp-ai-content-studios/thirukkural"
LOG_FILE="/var/log/thirukkural-deploy.log"

echo "[$(date)] Deployment started" >> $LOG_FILE

cd $REPO_PATH

git fetch origin
git reset --hard origin/master

if [ -f "package.json" ]; then
    npm install
fi

echo "[$(date)] Deployment completed" >> $LOG_FILE
```

Make it executable:
```bash
chmod +x /home/jp-ai-content-studios/deploy.sh
```

---

## Step 3B️⃣: Kural Studio Service (AI Image Generation, Optional)

Kural Studio (`kural-detail.html` + `studio-server.js`) generates per-kural
character/scene images via Gemini and stores them in Google Drive. Full
credential setup (Gemini API key, Google OAuth client, Drive folder) is a
one-time process documented in `docs/KURAL_STUDIO_SETUP.md` — do that first.

```bash
cd /home/jp-ai-content-studios/thirukkural

# Export the vars from docs/KURAL_STUDIO_SETUP.md (or source a .env file)
pm2 start studio-server.js --name "thirukkural-studio"
pm2 save

pm2 logs thirukkural-studio
```

`studio-server.js` fails fast at boot (same as `deploy-webhook.js` does for
`WEBHOOK_SECRET`) if `GEMINI_API_KEY`, `GOOGLE_OAUTH_CLIENT_ID`,
`GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`, or
`GOOGLE_DRIVE_FOLDER_ID` is missing — check `pm2 logs` if it won't start.

If you're using the Docker Compose stack instead of PM2, this is already
wired up as the `studio` service in `docker-compose.yml` — just fill in the
same env vars in `.env` and `docker compose up -d --build`.

---

## Step 4️⃣: Open Firewall Port

```bash
# Allow port 3600 (webhook server)
sudo ufw allow 3600/tcp

# Allow port 3700 (Kural Studio API, if running it)
sudo ufw allow 3700/tcp

# Or if using UFW (check status first)
sudo ufw status
```

---

## Step 5️⃣: Configure GitHub Webhook

1. Go to: https://github.com/jayaprakashdigital/thirukkural/settings/hooks
2. Click **"Add webhook"**
3. Fill in:
   - **Payload URL:** `http://187.127.165.149:3600/webhook/deploy`
   - **Content type:** `application/json`
   - **Secret:** `thirukkural-deploy-secret` (same as in deploy-webhook.js)
   - **Events:** Select **"Just the push event"**
   - **Active:** ✅ Check this box

4. Click **"Add webhook"**

---

## Step 6️⃣: Set Up Web Server (Nginx)

```bash
# Install Nginx
sudo apt install -y nginx

# Create config for your app
sudo nano /etc/nginx/sites-available/thirukkural

# Paste this configuration:
```

```nginx
server {
    listen 80;
    server_name 187.127.165.149;

    root /home/jp-ai-content-studios/thirukkural;
    index index.html;

    # Serve static files
    location / {
        try_files $uri $uri/ =404;
    }

    # API calls
    location /api/ {
        proxy_pass http://localhost:3500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/thirukkural /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

---

## Step 7️⃣: Update Container Integration

To update your existing container at http://187.127.165.149:3500/:

```bash
# If using Docker
cd /home/jp-ai-content-studios/thirukkural

# Rebuild container
docker-compose up --build -d

# Or manually copy files if not using Docker
sudo cp -r . /var/www/thirukkural/
```

---

## Step 8️⃣: Test Deployment

### Test Webhook Manually:

```bash
# From your local machine (PowerShell)
$webhook_url = "http://187.127.165.149:3600/webhook/deploy"
$secret = "thirukkural-deploy-secret"
$payload = @{
    ref = "refs/heads/master"
    after = "b1fffa5"
    head_commit = @{
        message = "Test deployment"
    }
}

$json = $payload | ConvertTo-Json
$body = [System.Text.Encoding]::UTF8.GetBytes($json)

# Calculate HMAC
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($secret)
$signature = "sha256=" + ([System.BitConverter]::ToString($hmac.ComputeHash($body)) -replace '-', '').ToLower()

Invoke-WebRequest -Uri $webhook_url `
    -Method POST `
    -Headers @{"X-Hub-Signature-256" = $signature; "X-GitHub-Event" = "push"} `
    -ContentType "application/json" `
    -Body $json
```

### Test by Pushing Code:

```bash
# Make a small change
cd C:\Users\JP\Documents\thiru-cur
git add .
git commit -m "Test deployment trigger"
git push origin master

# Watch the logs on VPS
ssh root@187.127.165.149
pm2 logs thirukkural-webhook
# or
tail -f /var/log/thirukkural-deploy.log
```

---

## 🔗 URLs After Deployment

- **Main Site:** http://187.127.165.149/
- **Dashboard:** http://187.127.165.149/dashboard.html
- **Kurals Database:** http://187.127.165.149/kurals.html
- **Stories:** http://187.127.165.149/stories.html
- **Characters:** http://187.127.165.149/characters-table.html
- **Webhook Health:** http://187.127.165.149:3600/health
- **Kural Studio Health:** http://187.127.165.149:3700/health (or `/studio/status/TK-0001` through nginx)

---

## 📋 Troubleshooting

### Webhook not triggering?
```bash
# Check if server is running
ps aux | grep node
pm2 list

# Check logs
pm2 logs thirukkural-webhook
tail -f /var/log/thirukkural-deploy.log
```

### Git permission issues?
```bash
# Configure git on VPS
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"

# Fix permissions
sudo chown -R $USER:$USER /home/jp-ai-content-studios/thirukkural
```

### Port already in use?
```bash
# Check what's using port 3600
sudo lsof -i :3600

# Kill process if needed
sudo kill -9 <PID>
```

### Nginx not serving files?
```bash
# Check Nginx status
sudo systemctl status nginx

# Check error log
sudo tail -f /var/log/nginx/error.log

# Reload config
sudo nginx -t && sudo systemctl reload nginx
```

---

## 📝 Quick Command Reference

```bash
# SSH into VPS
ssh -i ~/.ssh/thirukkural_vps root@187.127.165.149

# Pull latest code
cd /home/jp-ai-content-studios/thirukkural && git pull origin master

# Check webhook status
pm2 status

# View webhook logs
pm2 logs thirukkural-webhook

# Restart webhook
pm2 restart thirukkural-webhook

# Stop webhook
pm2 stop thirukkural-webhook

# Restart Nginx
sudo systemctl restart nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## ✅ Deployment Checklist

- [ ] SSH key set up
- [ ] Repository cloned on VPS
- [ ] Node.js installed
- [ ] Webhook server running (PM2)
- [ ] Firewall port 3600 opened
- [ ] GitHub webhook configured
- [ ] Nginx installed and configured
- [ ] Test push triggers deployment
- [ ] Site accessible at http://187.127.165.149/
- [ ] Container updated with latest code

---

**Need help?** Run these commands to diagnose:

```bash
# Full system info
uname -a
node --version
npm --version
nginx -v
git --version

# Network info
netstat -tlnp | grep 3600
netstat -tlnp | grep 80

# Disk space
df -h

# Memory usage
free -h
```
