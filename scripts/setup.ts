#!/usr/bin/env ts-node
/**
 * scripts/setup.ts
 *
 * One-time setup script: prompts for admin email + password,
 * hashes the password with bcrypt, and writes both to your .env file.
 *
 * Run with:  npm run setup
 */

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';

const ENV_PATH = path.join(process.cwd(), '.env');

function prompt(query: string): Promise<string> {
  const rl = readline.createInterface({
    input:  process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function updateEnv(key: string, value: string) {
  let env = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf-8') : '';
  const regex = new RegExp(`^${key}=.*$`, 'm');
  const formattedValue = `"${value.replace(/"/g, '\\"')}"`;

  if (regex.test(env)) {
    env = env.replace(regex, `${key}=${formattedValue}`);
  } else {
    env += `\n${key}=${formattedValue}`;
  }
  fs.writeFileSync(ENV_PATH, env);
}

async function main() {
  console.log('\n─────────────────────────────────────');
  console.log('  Blog Admin Setup');
  console.log('─────────────────────────────────────\n');

  const email = await prompt('Admin email: ');
  if (!email || !email.includes('@')) {
    console.error('Error: Invalid email address.');
    process.exit(1);
  }

  const password = await prompt('Admin password: ');
  if (!password || password.length < 6) {
    console.error('Error: Password must be at least 6 characters.');
    process.exit(1);
  }

  console.log('\nHashing password...');
  const hash = await bcrypt.hash(password, 12);

  // Generate a NextAuth secret if not set
  const envContent = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf-8') : '';
  const hasSecret = /NEXTAUTH_SECRET=.+/.test(envContent);

  updateEnv('ADMIN_EMAIL', email);
  updateEnv('ADMIN_PASSWORD_HASH', hash);

  if (!hasSecret || envContent.includes('replace-with-output-of-openssl-rand-base64-32')) {
    const secret = crypto.randomBytes(32).toString('base64');
    updateEnv('NEXTAUTH_SECRET', secret);
    console.log('✓ Generated NEXTAUTH_SECRET');
  }

  console.log('✓ Admin credentials saved to .env');
  console.log('\nLogin at http://localhost:3000/login\n');
}

main().catch(console.error);
