<img src="https://user-images.githubusercontent.com/3461986/98061159-41affb80-1e19-11eb-81d3-3d27f174cf8d.png" alt="Factorio builds" align="center" /><br />

This project aims to be a website and tool to share and browse [blueprints](https://wiki.factorio.com/Blueprint) for the [Factorio](https://factorio.com/) game, with strong values in user experience to make it the least painful experience to search/filter, and create builds.


### Stack

- React (https://reactjs.org/)
- Nextjs (https://nextjs.org/)
- TypeScript (https://www.typescriptlang.org/)

### Pre-requisites

- Node (12.19.0)<br />
  https://nodejs.org/download/release/v12.19.0/ or via `nvm`<br />
- Yarn<br />
  https://classic.yarnpkg.com/lang/en/

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
  `yarn`
- Start Docker<br />
  `docker-compose -f docker-compose.yml up`
- Migrate/seed the database<br />
  `yarn typeorm schema:sync`<br />
  `yarn db:seed:run`
- Start the dev server<br />
  `yarn dev`

Having problems with setting up the project? Open an issue!
