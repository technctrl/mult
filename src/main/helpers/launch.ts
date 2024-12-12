// logger.ts
import os from 'os';
import * as fs from 'fs';
import du from 'du';

// Function to get memory usage
function getMemoryUsage(): string {
  const memoryUsage = process.memoryUsage();
  const rss = (memoryUsage.rss / (1024 * 1024)).toFixed(2); // Resident Set Size
  const heapTotal = (memoryUsage.heapTotal / (1024 * 1024)).toFixed(2); // Total heap size
  return `${heapTotal} MB / ${rss} MB`;
}

// Function to get Node.js version
function getNodeVersion(): string {
  return process.version;
}

// Function to get current date and time
function getCurrentDateTime(): string {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

// Function to get project details from package.json
function getProjectDetails(): { name: string, version: string } {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return {
    name: packageJson.name,
    version: packageJson.version,
  };
}

async function getDirectorySize(directory: string): Promise<number> {
  return new Promise((resolve, reject) => {
    du(directory, (err, size) => {
      if (err) {
        reject(err);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resolve(size);
      }
    });
  });
}

async function getProjectSize(): Promise<string> {
  const projectDir = process.cwd();
  const nodeModulesDir = `${projectDir}/node_modules`;

  const [projectSize, nodeModulesSize] = await Promise.all([
    getDirectorySize(projectDir),
    getDirectorySize(nodeModulesDir).catch(() => 0) // If node_modules doesn't exist, return 0
  ]);

  const sizeExcludingNodeModules = projectSize - nodeModulesSize;
  return `${(sizeExcludingNodeModules / (1024 * 1024)).toFixed(2)} MB`; // Convert bytes to MB
}


// Function to print log
export async function printStartupLog(): Promise<void> {
  const memoryUsage = getMemoryUsage();
  const nodeVersion = getNodeVersion();
  const osInfo = `${os.type()} ${os.release()}`;
  const { name, version } = getProjectDetails();
  const currentDate = getCurrentDateTime();
  const mode = process.env.NODE_ENV || 'development';
  const port = process.env.PORT || 5000;
  const db_type = process.env.DB_TYPE || 'mongodb';
  const user = os.userInfo().username;
  const projectSize = await getProjectSize();

  const log = `
========================================================
PID          : ${process.pid}
Node.js      : ${nodeVersion}
OS           : ${osInfo}
Memory       : ${memoryUsage}
size         : ${projectSize}
User         : ${user}
========================================================
Name         : ${name}
Version      : ${version}
Date         : ${currentDate}
Mode         : ${mode}
========================================================
Port         : ${port}
Database     : ${db_type}
========================================================
`;

  console.log(log);
}