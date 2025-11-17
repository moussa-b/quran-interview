## About This Project

This is a demo project created to apply for the **Full-Stack Engineer** position at Quran Foundation. You can find the job posting here: [Quran Foundation - Full-Stack Engineer](https://quran.foundation/careers/full-stack-engineer)

### Important Notice

The data used in this project is **only for POC (Proof of Concept) purposes** for the interview process. The data has **not been fully tested and validated** and should not be considered production-ready.

---

## Project Overview

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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

## Deploying to Google Cloud Run

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) so you can use `gcloud` on the command line.
1. Run `gcloud auth login` to log in to your account.
1. [Create a new project](https://cloud.google.com/run/docs/quickstarts/build-and-deploy) in Google Cloud Run (e.g. `nextjs-docker`). Ensure billing is turned on.
1. Build your container image using Cloud Build: `gcloud builds submit --tag gcr.io/PROJECT-ID/helloworld --project PROJECT-ID`. This will also enable Cloud Build for your project.
1. Deploy to Cloud Run: `gcloud run deploy --image gcr.io/PROJECT-ID/helloworld --project PROJECT-ID --platform managed --allow-unauthenticated`. Choose a region of your choice.

    - You will be prompted for the service name: press Enter to accept the default name, `helloworld`.
    - You will be prompted for [region](https://cloud.google.com/run/docs/quickstarts/build-and-deploy#follow-cloud-run): select the region of your choice, for example `us-central1`.
