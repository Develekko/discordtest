import * as dotenv from 'dotenv';
dotenv.config();
import { client } from './utils/client.js';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const eventsPath = path.join(__dirname.replace(/^\/([a-z]):\//i, '$1:/'), 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = await import(`./events/${file}`);
  client.on(event.default.name, event.default.run.bind(null, client));
}

client.login(process.env.DISCORD_TOKEN);