# ⚡ Quick VPS Deployment Setup (15 minutes)

## Your VPS Details
```
IP: 187.127.165.149
OS: Ubuntu 24.04
Folder: /home/jp-ai-content-studios
```

---

## 🚀 STEP 1: SSH Setup (3 min)

### On your computer (PowerShell):

```powershell
# Generate SSH key
ssh-keygen -t rsa -b 4096 -f $env:USERPROFILE\.ssh\thirukkural_vps

# Add to VPS (copy public key to authorized_keys on VPS)
type $env:USERPROFILE\.ssh\thirukkural_vps.pub | ssh root@187.127.165.149 "cat >> ~/.ssh/authorized_keys"

# Test connection
ssh -i $env:USERPROFILE\.ssh\thirukkural_vps root@187.127.165.149

# If successful, you're in! Type: exit
```

---

## 🚀 STEP 2: Clone Repository (2 min)

### On VPS (after SSH login):

```bash
cd /home/jp-ai-content-studios

# Clone repo
git clone https://github.com/jayaprakashdigital/thirukkural.git
cd thirukkural

# Verify it worked
ls -la
```

---

## 🚀 STEP 3: Install Node.js (3 min)

### On VPS:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

---

## 🚀 STEP 4: Set Up Webhook Deployment (4 min)

### On VPS:

```bash
# Go to repo folder
cd /home/jp-ai-content-studios/thirukkural

# Install dependencies
npm install express crypto

# Install PM2 (keeps webhook running)
sudo npm install -g pm2

# Start webhook service
pm2 start deploy-webhook.js --name "thirukkural-webhook"

# Make it auto-start on reboot
pm2 startup
pm2 save

# Verify it's running
pm2 list
pm2 logs thirukkural-webhook
```

### Open Firewall Port:

```bash
# Allow port 3600 for webhook
sudo ufw allow 3600/tcp
sudo ufw status
```

---

## 🚀 STEP 5: Configure GitHub Webhook (2 min)

1. Go to: https://github.com/jayaprakashdigital/thirukkural/settings/hooks
2. Click **"Add webhook"**
3. Enter:
   - **Payload URL:** `http://187.127.165.149:3600/webhook/deploy`
   - **Content type:** `application/json`
   - **Secret:** `thirukkural-deploy-secret`
   - **Events:** ✅ Just the push event
   - **Active:** ✅ Checked
4. Click **"Add webhook"**

---

## 🚀 STEP 6: Test It! (1 min)

### Make a test commit:

```bash
# On your local machine
cd C:\Users\JP\Documents\thiru-cur
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "Test webhook deployment"
git push origin main

# Check VPS logs (on VPS):
pm2 logs thirukkural-webhook

# You should see: "✅ Deployment successful!"
```

---

## 📍 Your Site is Now Live!

Access it at:
- **http://187.127.165.149/** (Homepage)
- **http://187.127.165.149/dashboard.html** (Dashboard)
- **http://187.127.165.149/kurals.html** (Kurals Database)

---

## ✅ Verify Everything Works

```bash
# On your local machine, test the webhook
curl http://187.127.165.149:3600/health

# Should return: {"status":"ok","timestamp":"..."}
```

---

## 🔧 If Something Goes Wrong

### Check webhook is running:
```bash
pm2 list
pm2 logs thirukkural-webhook
```

### Manually pull latest code:
```bash
cd /home/jp-ai-content-studios/thirukkural
git pull origin main
```

### Restart webhook:
```bash
pm2 restart thirukkural-webhook
```

### Check VPS logs:
```bash
tail -f /var/log/thirukkural-deploy.log
```

---

## 🎯 Now You Have:

✅ Repository cloned on VPS  
✅ Automatic deployment on every git push  
✅ Webhook server running on port 3600  
✅ Site live at http://187.127.165.149/  
✅ Auto-updates when you push to GitHub  

🚀 **You're Done!**

Push to main, and your site updates automatically!

```bash
git push origin main
# Site updates in seconds!
```
