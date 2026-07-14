#!/usr/bin/env node
/**
 * GitHub Webhook Receiver for Automatic Deployment
 * This script listens for GitHub webhooks and automatically pulls the latest code
 *
 * Setup:
 * 1. Run: npm install express crypto
 * 2. Create a GitHub webhook pointing to your VPS
 * 3. Run this script: node deploy-webhook.js
 */

const express = require('express');
const crypto = require('crypto');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3600; // Port for webhook (make sure it's open in firewall)

// Configuration
const WEBHOOK_SECRET = 'thirukkural-deploy-secret'; // Change this to something secure
const REPO_PATH = '/home/jp-ai-content-studios/thirukkural'; // Path where repo is cloned
const LOG_FILE = '/var/log/thirukkural-deploy.log';

app.use(express.json());

// Create log file if it doesn't exist
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, '');
}

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage);
}

function verifySignature(req, secret) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    return false;
  }

  const payload = JSON.stringify(req.body);
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature === `sha256=${hash}`;
}

// Webhook endpoint
app.post('/webhook/deploy', (req, res) => {
  log('📨 Webhook received');

  // Verify GitHub signature
  if (!verifySignature(req, WEBHOOK_SECRET)) {
    log('❌ Webhook signature verification failed');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const event = req.headers['x-github-event'];
  const payload = req.body;

  if (event !== 'push') {
    log(`⏭️  Skipping event: ${event} (only push events trigger deployment)`);
    return res.status(200).json({ message: 'Skipped' });
  }

  const branch = payload.ref.split('/').pop();
  log(`🔄 Push event on branch: ${branch}`);

  // Only deploy on master branch
  if (branch !== 'master') {
    log(`⏭️  Skipping deployment: not on master branch`);
    return res.status(200).json({ message: 'Skipped (not master branch)' });
  }

  try {
    log('🚀 Starting deployment...');

    // Change to repo directory
    process.chdir(REPO_PATH);

    // Pull latest code
    log('📥 Pulling latest code from GitHub...');
    execSync('git fetch origin', { stdio: 'pipe' });
    execSync('git reset --hard origin/master', { stdio: 'pipe' });

    // Install dependencies if needed
    if (fs.existsSync(path.join(REPO_PATH, 'package.json'))) {
      log('📦 Installing dependencies...');
      execSync('npm install', { stdio: 'pipe' });
    }

    log('✅ Deployment successful!');
    log(`📍 Deployed commit: ${payload.after.substring(0, 7)}`);
    log(`📝 Message: ${payload.head_commit.message}`);

    res.status(200).json({
      success: true,
      message: 'Deployment completed successfully',
      commit: payload.after.substring(0, 7),
      branch: branch
    });

  } catch (error) {
    log(`❌ Deployment failed: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  log(`🎯 Webhook server listening on port ${PORT}`);
  log(`📍 Webhook URL: http://187.127.165.149:${PORT}/webhook/deploy`);
  log(`🔐 Webhook Secret: ${WEBHOOK_SECRET}`);
});
