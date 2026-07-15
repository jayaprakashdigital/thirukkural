# Claude Code SSH VPS Setup

This guide explains how to connect Claude Code to your VPS over SSH for direct remote development.

## Quick Start

### Prerequisites
- Claude Code Desktop or Web
- SSH access to VPS (187.127.165.149)
- SSH key pair configured locally
- VPS with Ubuntu 24.04 (already set up)

### Step 1: Prepare SSH Key

If you haven't already created an SSH key, generate one:

```bash
# On your local machine (PowerShell)
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\thirukkural_vps -C "claude-vps-access"

# Or for compatibility with older systems:
ssh-keygen -t rsa -b 4096 -f $env:USERPROFILE\.ssh\thirukkural_vps -C "claude-vps-access"
```

### Step 2: Add Public Key to VPS

```bash
# Copy public key to VPS authorized_keys
type $env:USERPROFILE\.ssh\thirukkural_vps.pub | ssh root@187.127.165.149 "cat >> ~/.ssh/authorized_keys"

# Test connection
ssh -i $env:USERPROFILE\.ssh\thirukkural_vps root@187.127.165.149 "echo 'SSH connection successful'"
```

### Step 3: Connect Claude Code to VPS

#### Option A: Claude Code Desktop

1. Open **Claude Code Desktop**
2. Go to **Settings** → **Environments** → **Add SSH Connection**
3. Fill in the connection details:
   - **Name:** `Thirukkural VPS`
   - **Host:** `root@187.127.165.149`
   - **Port:** `22` (default SSH port)
   - **SSH Key Path:** `~/.ssh/thirukkural_vps` (or your key path)
   - **Remote Path:** `/home/jp-ai-content-studios/thirukkural`

4. Click **Connect**
5. Select the project folder when prompted

#### Option B: Claude Code Web (claude.ai/code)

Currently, Claude Code Web works primarily with GitHub-hosted repositories. For SSH VPS access, use the Desktop app or set up a remote session via GitHub integration.

### Step 4: Configure for Development

Once connected, you can:

- **Edit files directly** on the VPS using Claude Code
- **Run commands** on the remote server
- **Install dependencies** (npm, git, etc.)
- **Deploy changes** automatically
- **View logs** and debug in real-time

## VPS Environment Details

```
🖥️ Server Information
├── IP Address: 187.127.165.149
├── OS: Ubuntu 24.04
├── Root Directory: /home/jp-ai-content-studios/thirukkural
├── Package Manager: npm
└── Port (Webhook): 3600
```

### Pre-Installed Services

- **Node.js:** Runtime for JavaScript
- **npm:** Package management
- **PM2:** Process management
- **Nginx:** Web server
- **Docker:** Container platform (optional)

## Common Workflows

### Develop on VPS

```bash
# From Claude Code terminal
cd /home/jp-ai-content-studios/thirukkural

# Install dependencies
npm install

# Run development server
npm start

# View logs
tail -f /var/log/thirukkural-deploy.log
```

### Deploy Changes

Changes pushed to the main branch trigger automatic webhook deployment:

```bash
# 1. Make changes in Claude Code
# 2. Commit changes
git add .
git commit -m "Your message"

# 3. Push to main branch
git push origin master

# 4. Webhook automatically pulls and deploys on VPS
# Monitor deployment:
pm2 logs thirukkural-webhook
```

### Manage Webhook Service

```bash
# Check status
pm2 list

# View logs
pm2 logs thirukkural-webhook

# Restart webhook
pm2 restart thirukkural-webhook

# Stop webhook
pm2 stop thirukkural-webhook

# Start webhook
pm2 start thirukkural-webhook
```

## Security Best Practices

### 🔐 SSH Security

1. **Use Ed25519 keys** (preferred):
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```

2. **Restrict SSH key permissions**:
   ```bash
   chmod 600 ~/.ssh/thirukkural_vps
   chmod 700 ~/.ssh
   ```

3. **Disable root SSH login** (recommended):
   ```bash
   # On VPS:
   sudo nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   ```

4. **Use key-based authentication only**:
   ```bash
   # On VPS:
   sudo nano /etc/ssh/sshd_config
   # Set: PasswordAuthentication no
   # Restart: sudo systemctl restart ssh
   ```

### 🛡️ Firewall Rules

```bash
# Allow SSH (port 22)
sudo ufw allow 22/tcp

# Allow HTTP (port 80)
sudo ufw allow 80/tcp

# Allow HTTPS (port 443)
sudo ufw allow 443/tcp

# Allow webhook port (port 3600)
sudo ufw allow 3600/tcp

# Enable firewall
sudo ufw enable
```

### 📋 Secrets Management

**DO NOT** commit secrets! Use environment variables:

```bash
# On VPS, create .env file
nano /home/jp-ai-content-studios/thirukkural/.env

# Example:
GITHUB_TOKEN=your_secret_token
DB_PASSWORD=your_db_password
API_KEY=your_api_key

# Restrict access
chmod 600 /home/jp-ai-content-studios/thirukkural/.env
```

Update `.gitignore`:
```
.env
.env.local
.env*.local
*.pem
*.key
.ssh/
```

## Troubleshooting

### SSH Connection Issues

```bash
# Test SSH connection with verbose output
ssh -vvv -i ~/.ssh/thirukkural_vps root@187.127.165.149

# Check if SSH service is running on VPS
sudo systemctl status ssh

# Check SSH port
netstat -tlnp | grep :22
```

### Permission Denied

```bash
# Verify key permissions
ls -la ~/.ssh/
# Should show: -rw------- for private key

# Fix permissions
chmod 600 ~/.ssh/thirukkural_vps
chmod 700 ~/.ssh

# Verify public key on VPS
cat ~/.ssh/authorized_keys
# Your key should be in there
```

### Connection Timeout

```bash
# Check firewall
sudo ufw status
sudo ufw allow 22/tcp

# Check if SSH daemon is listening
sudo ss -tlnp | grep sshd

# Restart SSH service
sudo systemctl restart ssh
```

### Slow SSH Connection

```bash
# Use SSH compression
ssh -C -i ~/.ssh/thirukkural_vps root@187.127.165.149

# Or update ~/.ssh/config:
Host thirukkural-vps
    HostName 187.127.165.149
    User root
    IdentityFile ~/.ssh/thirukkural_vps
    Compression yes
    StrictHostKeyChecking accept-new
```

## SSH Config File (Recommended)

Create `~/.ssh/config` for easier connection:

```
Host thirukkural-vps
    HostName 187.127.165.149
    User root
    IdentityFile ~/.ssh/thirukkural_vps
    Port 22
    StrictHostKeyChecking accept-new
    UserKnownHostsFile ~/.ssh/known_hosts
    AddKeysToAgent yes
    IdentitiesOnly yes
    ConnectionAttempts 3
    ConnectTimeout 10
```

Then connect with:
```bash
ssh thirukkural-vps
# Or in Claude Code: thirukkural-vps@187.127.165.149
```

## Advanced Features

### Using SSH Agent (Windows)

```powershell
# Start SSH Agent
Start-Service ssh-agent

# Add your key to agent
ssh-add $env:USERPROFILE\.ssh\thirukkural_vps

# Verify keys in agent
ssh-add -l
```

### Using SSH Agent (Linux/Mac)

```bash
# Start SSH Agent
eval $(ssh-agent -s)

# Add your key to agent
ssh-add ~/.ssh/thirukkural_vps

# Verify keys in agent
ssh-add -l
```

### Port Forwarding

Forward remote ports to your local machine:

```bash
# Forward remote port 3500 to local 3500
ssh -L 3500:localhost:3500 -i ~/.ssh/thirukkural_vps root@187.127.165.149

# Forward remote port 3600 (webhook) to local
ssh -L 3600:localhost:3600 -i ~/.ssh/thirukkural_vps root@187.127.165.149
```

## Maintenance

### Keep SSH Keys Secure

- ✅ Store keys in `~/.ssh/` directory
- ✅ Use strong passphrases
- ✅ Rotate keys every 6-12 months
- ❌ Don't share private keys
- ❌ Don't commit keys to Git

### Regular Updates

```bash
# On VPS, update system
sudo apt update && sudo apt upgrade -y

# Update Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Monitor SSH Activity

```bash
# View recent SSH logins
sudo journalctl -u ssh -n 20

# Check failed login attempts
sudo grep "Failed password" /var/log/auth.log | tail -20
```

## Related Documentation

- [VPS Deployment Guide](./VPS_DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Claude Code Docs](https://code.claude.com/docs/) - Official Claude Code documentation
- [SSH Security Guide](https://man.openbsd.org/ssh_config) - OpenSSH configuration manual

## Quick Reference Commands

```bash
# Connect to VPS
ssh thirukkural-vps

# Copy files to VPS
scp -r local_folder thirukkural-vps:/remote/path/

# Copy files from VPS
scp -r thirukkural-vps:/remote/path/ local_folder/

# Execute command on VPS
ssh thirukkural-vps 'command_to_run'

# Create SSH tunnel
ssh -N -L 3500:localhost:3500 thirukkural-vps
```

## Support & Help

For issues with Claude Code SSH setup:
1. Check the troubleshooting section above
2. Review VPS logs: `tail -f /var/log/syslog`
3. Test SSH connection: `ssh -vvv thirukkural-vps`
4. Contact Claude Code support: https://claude.ai/help

---

**Last Updated:** 2026-07-15
**Branch:** claude/code-ssh-vps-setup-vdo0fx
