import * as dotenv from 'dotenv';
dotenv.config();
import { client } from './utils/client.js';
import fs from 'fs';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const eventsPath = path.join(__dirname.replace(/^\/([a-z]):\//i, '$1:/'), 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {;
	const filePath = path.join(eventsPath, file);
  await import(`file://${filePath}`);
}
client.login(process.env.DISCORD_TOKEN)