# Cloudinary Image Storage Setup

This project uses Cloudinary for free image storage. Your credentials are already provided below.

## Your Cloudinary Credentials

- **Cloud Name**: `dychd94d2`
- **API Key**: `599651416287167`
- **API Secret**: `jrir_BYi0GFCJtcGqE1CfluHW9E`

> **Note**: For unsigned uploads (frontend-only), we only need the Cloud Name and an Upload Preset. The API key and secret are not needed for this setup.

## Step 1: Create an Upload Preset (REQUIRED)

You need to create an unsigned upload preset in your Cloudinary dashboard:

1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Click on **Settings** (gear icon in the top right)
3. Click on **Upload** in the left sidebar
4. Scroll down to the **Upload presets** section
5. Click **Add upload preset** button
6. Configure the preset:
   - **Preset name**: `bavari-upload` (or any name you prefer)
   - **Signing mode**: Select **Unsigned** ⚠️ (This is important - it allows direct uploads from the frontend)
   - **Folder**: `bavari-products` (optional, but recommended for organization)
   - **Format**: Leave as default or set to `auto` for automatic format optimization
   - Leave other settings as default
7. Click **Save** at the bottom

> **Important**: Make sure the signing mode is set to **Unsigned**, otherwise uploads will fail!

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in the `frontend` directory (if it doesn't exist)

2. Add the following environment variables to `.env.local`:
   ```env
   # API Configuration (if not already present)
   NEXT_PUBLIC_API_URL=http://localhost:3001/api

   # Cloudinary Configuration
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dychd94d2
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=bavari-upload
   ```

   > **Note**: Replace `bavari-upload` with the actual preset name you created in Step 1 if you used a different name.

## Step 3: Restart Your Development Server

After adding the environment variables, restart your Next.js development server:

```bash
npm run dev
# or
yarn dev
```

## Usage

Once configured, you can upload images through the Product Modal in the admin panel. Images will be automatically uploaded to Cloudinary and the URLs will be stored in your database.

## Troubleshooting

- **"Cloudinary is not configured" error**: Make sure your `.env.local` file exists and contains the correct environment variables
- **Upload fails**: Verify that your upload preset is set to "Unsigned" mode
- **CORS errors**: Cloudinary should handle CORS automatically, but if you encounter issues, check your Cloudinary settings

## Benefits of Cloudinary

- ✅ Free tier with generous limits
- ✅ Automatic image optimization
- ✅ CDN delivery for fast loading
- ✅ Image transformations (resize, crop, etc.)
- ✅ No backend code required for uploads

