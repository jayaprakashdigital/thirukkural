#!/usr/bin/env node
/**
 * GitHub Webhook Receiver for Automatic Deployment
 * This script listens for GitHub webhooks and automatically pulls the latest code
 *
 * Setup:
 * 1. Run: npm install express
 * 2. Set environment variables (see Configuration below) — NEVER hardcode secrets.
 * 3. Create a GitHub webhook pointing to your VPS
 * 4. Run this script: WEBHOOK_SECRET=... node deploy-webhook.js
 *
 * Configuration (environment variables):
 *   WEBHOOK_SECRET — GitHub webhook secret (REQUIRED, fails fast if missing)
 *   PORT           — HTTP port to listen on (default 3600)
 *   REPO_PATH      — absolute path to the cloned repo (default cwd)
 *   LOG_FILE       — absolute path to the deploy log (default /var/log/thirukkural-deploy.log)
 */

const express = require('express');
const crypto = require('crypto');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = parseInt(process.env.PORT || '3600', 10);

// Configuration — read everything from the environment; never hardcode secrets.
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const REPO_PATH = process.env.REPO_PATH || process.cwd();
const LOG_FILE = process.env.LOG_FILE || '/var/log/thirukkural-deploy.log';

if (!WEBHOOK_SECRET) {
  console.error('FATAL: WEBHOOK_SECRET environment variable is not set. Refusing to start.');
  process.exit(1);
}

// Capture the raw request body so the HMAC signature can be verified against the
// exact bytes GitHub sent. Re-serializing parsed JSON is NOT byte-stable.
app.use(express.json({
  verify: (req, _res, buf) => { req.rawBody = buf; }
}));

// Create log file if it doesn't exist (never let logging crash the server).
function ensureLogFile() {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, '');
    }
  } catch (e) {
    console.error(`Warning: could not create log file at ${LOG_FILE}: ${e.message}`);
  }
}
ensureLogFile();

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trimEnd());
  try {
    fs.appendFileSync(LOG_FILE, logMessage);
  } catch (e) {
    // Logging must never take down the server — swallow write errors.
  }
}

function verifySignature(req, secret) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature || typeof signature !== 'string') {
    return false;
  }

  const payload = req.rawBody || Buffer.from(JSON.stringify(req.body || {}));
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const expected = `sha256=${hash}`;
  if (signature.length !== expected.length) return false;
  try {
    // Constant-time comparison to prevent timing attacks.
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

// Request logging middleware
app.use((req, _res, next) => {
  log(`${req.method} ${req.url}`);
  next();
});

// Webhook endpoint
app.post('/webhook/deploy', (req, res) => {
  log('Webhook received');

  // Verify GitHub signature
  if (!verifySignature(req, WEBHOOK_SECRET)) {
    log('Webhook signature verification failed');
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const event = req.headers['x-github-event'];
  const payload = req.body || {};

  if (event !== 'push') {
    log(`Skipping event: ${event} (only push events trigger deployment)`);
    return res.status(200).json({ success: true, message: 'Skipped' });
  }

  // Input validation — payload.ref must be a string or we cannot determine the branch.
  if (!payload || typeof payload.ref !== 'string') {
    log('Invalid payload: missing or invalid "ref"');
    return res.status(400).json({ success: false, error: 'Invalid payload: missing ref' });
  }

  const branch = payload.ref.split('/').pop();
  log(`Push event on branch: ${branch}`);

  // Only deploy on main branch
  if (branch !== 'main') {
    log('Skipping deployment: not on main branch');
    return res.status(200).json({ success: true, message: 'Skipped (not main branch)' });
  }

  try {
    log('Starting deployment...');

    // Change to repo directory
    process.chdir(REPO_PATH);

    // Pull latest code
    log('Pulling latest code from GitHub...');
    execSync('git fetch origin', { stdio: 'pipe' });
    execSync('git reset --hard origin/main', { stdio: 'pipe' });

    // Install dependencies if needed
    if (fs.existsSync(path.join(REPO_PATH, 'package.json'))) {
      log('Installing dependencies...');
      execSync('npm install', { stdio: 'pipe' });
    }

    // Safely extract commit metadata (guard against undefined fields).
    const commitSha = (typeof payload.after === 'string' ? payload.after : '').substring(0, 7) || 'unknown';
    const commitMsg =
      (payload.head_commit && typeof payload.head_commit.message === 'string')
        ? payload.head_commit.message
        : '(no message)';

    log('Deployment successful!');
    log(`Deployed commit: ${commitSha}`);
    log(`Message: ${commitMsg}`);

    res.status(200).json({
      success: true,
      message: 'Deployment completed successfully',
      commit: commitSha,
      branch: branch
    });

  } catch (error) {
    log(`Deployment failed: ${error.message}`);
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

// 404 catch-all (registered after all routes)
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

// Global Express error handler
app.use((err, req, res, _next) => {
  log(`Unhandled error: ${err.message}`);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Catch process-level failures so the server stays observable.
process.on('unhandledRejection', (reason) => {
  log(`Unhandled promise rejection: ${reason}`);
});
process.on('uncaughtException', (err) => {
  log(`Uncaught exception: ${err.message}`);
});

app.listen(PORT, () => {
  log(`Webhook server listening on port ${PORT}`);
  log(`Webhook URL: http://localhost:${PORT}/webhook/deploy`);
});
