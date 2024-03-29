import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
program.option('--mode <mode>', 'Modo de trabajo', 'DEVELOPMENT');
program.parse();

dotenv.config({
  path: program.opts().mode === 'DEVELOPMENT' ? '.env' : program.opts().mode === 'QA' ? '.env.qa' : '.env.production',
});

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  googleName:process.env.GOOGLE_NAME,
  googlePass:process.env.GOOGLE_PASS,
  httpPort:process.env.HTTP_PORT,
  gitHubId:process.env.GIT_HUB_ID,
  gitHubSecret:process.env.GIT_HUB_SECRET,
};