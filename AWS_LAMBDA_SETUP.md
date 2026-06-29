# AWS Lambda Video Rendering Setup Guide

Setting up AWS Lambda lets you render **100+ videos at the same time** with average render times of **3–5 seconds** per video under the AWS Free Tier.

The codebase is already configured to automatically switch to AWS Lambda the moment you define the AWS environment variables.

---

## Step 1 — Setup AWS Account & Credentials

1. Sign up/Log in to [console.aws.amazon.com](https://console.aws.amazon.com).
2. Go to the **IAM Console** (Identity and Access Management).
3. Create a new user named `remotion-renderer`.
4. Check **Access key - Programmatic access**.
5. Attach the `AdministratorAccess` policy to this user (or attach a custom Remotion policy using `npx remotion lambda policies create`).
6. Complete creation and copy the **Access Key ID** and **Secret Access Key**.

---

## Step 2 — Configure Local Environment

Add your AWS credentials to your local `.env.local` or environment variables:

```bash
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
REMOTION_AWS_REGION=us-east-1
```

---

## Step 3 — Deploy Remotion Lambda Functions to AWS

Run the following commands inside the project root directory:

```bash
# 1. Deploy the rendering function to AWS Lambda
npx remotion lambda functions deploy --region=us-east-1

# 2. Deploy your video template bundle (site) to Amazon S3
npx remotion lambda compositions deploy src/remotion/index.ts --region=us-east-1
```

After deploying the compositions, the CLI will output a **Serve URL** looking like this:
`https://remotionlambda-xxx.s3.us-east-1.amazonaws.com/sites/simulation/index.html`

Copy that URL!

---

## Step 4 — Bind AWS to your Cloud Run / Production Server

Add the following environment variables to your Google Cloud Run instance (or Vercel settings):

| Variable Name | Value |
|---|---|
| `REMOTION_AWS_ACCESS_KEY_ID` | *Your AWS Access Key ID* |
| `REMOTION_AWS_SECRET_ACCESS_KEY` | *Your AWS Secret Access Key* |
| `REMOTION_AWS_REGION` | `us-east-1` (or whichever region you deployed to) |
| `REMOTION_AWS_SERVE_URL` | *The S3 index.html Serve URL from Step 3* |

### Commands to update secrets on Google Cloud:

If you are using Cloud Run, you can save these in GCP Secret Manager:

```powershell
echo "YOUR_AWS_ACCESS_KEY_ID" | gcloud secrets create REMOTION_AWS_ACCESS_KEY_ID --data-file=-
echo "YOUR_AWS_SECRET_ACCESS_KEY" | gcloud secrets create REMOTION_AWS_SECRET_ACCESS_KEY --data-file=-
echo "us-east-1" | gcloud secrets create REMOTION_AWS_REGION --data-file=-
echo "YOUR_S3_SERVE_URL" | gcloud secrets create REMOTION_AWS_SERVE_URL --data-file=-
```

Then grant your Cloud Run compute service account access to these secrets, and you are ready! The server will instantly route all video render tasks to AWS Lambda, making renders 5x faster and saving 100% of your web server's memory.
