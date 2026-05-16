# Factorio Builds/Tech Frontend

This project aims to be a website and tool to share and browse [blueprints](https://wiki.factorio.com/Blueprint) for the [Factorio](https://factorio.com/) game, with strong values in user experience to make it the least painful experience to search/filter, and create builds.

### Stack

- React (https://reactjs.org/)
- Nextjs (https://nextjs.org/)
- TypeScript (https://www.typescriptlang.org/)

### Pre-requisites

- Node 16<br />
  https://nodejs.org/ or via `nvm`

### Get started

From the terminal, in the checked out directory:

- Duplicate the env file<br />
  `cp .env.example .env`
- Fill `.env` file with your AWS and Discord credentials<br />
  `AWS_S3_BUCKET=""`<br />
  `AWS_ACCESS_KEY_ID=""`<br />
  `AWS_SECRET_ACCESS_KEY=""`<br />
  `DISCORD_CLIENT_ID=""`<br />
  `DISCORD_CLIENT_SECRET=""`
- Install dependencies<br />
  `npm install`
- Start Docker<br />
  `docker-compose -f docker-compose.yml up`
- Migrate/seed the database<br />
  `npm run typeorm schema:sync`<br />
  `npm run db:seed:run`
- Start the dev server<br />
  `npm run dev`

Having problems with setting up the project? Open an issue!
