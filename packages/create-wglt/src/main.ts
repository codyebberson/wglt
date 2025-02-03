#!/usr/bin/env node

import cp from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';

interface ProjectConfig {
  projectName: string;
}

async function prompt(
  terminal: readline.Interface,
  question: string,
  defaultValue: string,
  validationFunc: (str: string) => boolean | string,
  validationMessage: string
): Promise<string> {
  while (true) {
    const defaultPrompt = defaultValue ? ` (${defaultValue})` : '';
    const answer = (await terminal.question(`${question}${defaultPrompt}: `)) || defaultValue;
    if (validationFunc(answer)) {
      return answer;
    }
    console.log(validationMessage);
  }
}

async function promptForConfig(): Promise<ProjectConfig> {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Prompt the user for the project name
  const projectName = await prompt(
    terminal,
    'What is your project name?',
    'wglt-hello-world',
    (name) => name && /^[a-zA-Z0-9-_]+$/.test(name),
    'Project name may only include letters, numbers, dashes, and underscores'
  );

  // Cleanup
  terminal.close();

  return { projectName };
}

async function initializeProject(config: ProjectConfig): Promise<void> {
  const projectDir = path.join(process.cwd(), config.projectName);

  try {
    // Clone the repository
    console.log('Cloning starter project...');
    cp.execSync(`git clone git@github.com:codyebberson/wglt-hello-world ${config.projectName}`, {
      stdio: 'inherit',
    });

    // Remove .git directory
    fs.rmSync(path.join(projectDir, '.git'), { recursive: true, force: true });

    // Initialize new git repository
    console.log('Initializing new git repository...');
    cp.execSync('git init', { cwd: projectDir, stdio: 'inherit' });
    cp.execSync('git add .', { cwd: projectDir, stdio: 'inherit' });
    cp.execSync('git commit -m "Initial commit from WGLT initializer"', {
      cwd: projectDir,
      stdio: 'inherit',
    });

    // Install dependencies
    console.log('Installing dependencies...');
    cp.execSync('npm install', { cwd: projectDir, stdio: 'inherit' });

    console.log(`Successfully created project ${config.projectName}!`);
    console.log('Next steps:');
    console.log(`  cd ${config.projectName}`);
    console.log('  npm start');
  } catch (error) {
    console.error('Error initializing project:', error);
    // Clean up on failure
    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
    throw error;
  }
}

export async function main(): Promise<void> {
  console.log('Welcome to WGLT project initializer!');
  const config = await promptForConfig();
  await initializeProject(config);
}

if (process.env.NODE_ENV !== 'test') {
  main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}
