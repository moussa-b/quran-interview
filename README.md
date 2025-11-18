## About This Project

This is a demo project created to apply for the **Full-Stack Engineer** position at Quran Foundation. You can find the job posting here: [Quran Foundation - Full-Stack Engineer](https://quran.foundation/careers/full-stack-engineer)

### Important Notice

The data used in this project is **only for POC (Proof of Concept) purposes** for the interview process. The data has **not been fully tested and validated** and should not be considered production-ready.

---

## Project Overview

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

The UI stack combines [shadcn/ui](https://ui.shadcn.com) for composable components.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Local Database (MySQL)

A ready-made Docker Compose stack lives in `docs/db/docker-compose.yml`. It provisions MySQL, runs the schema/seed script from `docs/db/create_db.sql`, and exposes the database on port `3308`.

1. Start Docker Desktop (or your preferred Docker runtime).
2. From the repository root run:

   ```bash
   cd docs/db
   docker compose up -d
   ```

3. Wait for the `quran_interview_mysql` container to report `healthy` (`docker compose ps`).
4. Connect with any MySQL client using `mysql://nextjs:nextjs@127.0.0.1:3308/quran`.

To stop the database:

```shell
docker compose down
```

To wipe the `quran_mysql_data` volume and reload the schema on the next start:

```shell
docker compose down -v
```

## Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.

2.Build your container:
```bash
# For npm, pnpm or yarn
docker build -t nextjs-docker .
```

3. Run your container temporarily: 
```bash
docker run --rm --name quran-interview-nextjs-app -p 3000:3000 nextjs-docker
```

4. Or run your container and keep it :
```bash
docker run --name quran-interview-nextjs-app -p 3000:3000 nextjs-docker
```

You can view your images created with `docker images`.

### In existing projects

To add Docker support, copy [`Dockerfile`](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile) to the project root. If using Bun, copy [`Dockerfile.bun`](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile.bun) instead. Then add the following to next.config.js:

```js
// next.config.js
module.exports = {
  // ... rest of the configuration.
  output: "standalone",
};
```

This will build the project as a standalone app inside the Docker image.

## Automated Docker Hub Publishing

The workflow in `.github/workflows/docker-publish.yml` builds the container image with Docker Buildx and pushes it to [Docker Hub](https://hub.docker.com/) whenever changes land on `main` (you can also run it manually with the **Run workflow** button). To enable it:

1. Create (or pick) a public/private repository in your Docker Hub account where the `quran-interview` image should live.
2. In the GitHub repository settings, add the following secrets under **Settings → Secrets and variables → Actions**:
   - `DOCKERHUB_USERNAME`: your Docker Hub username.
   - `DOCKERHUB_TOKEN`: a Docker Hub access token (create one from **Account Settings → Security → New Access Token**).
3. Once the secrets are in place, every push to `main` will produce and push the tags `latest`, the branch/tag name, the commit SHA, and an auto-incrementing semantic tag `v<run-number>` that increments with each workflow execution (e.g., `v12`, `v13`, ...). This gives you a monotonically increasing version you can use in deployments without having to create Git tags manually.

By default the images are published as `DOCKERHUB_USERNAME/quran-interview`. Edit the `IMAGE_NAME` value inside the workflow if you prefer a different repository or organization.
