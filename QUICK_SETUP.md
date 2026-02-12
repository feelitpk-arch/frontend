# Quick Cloudinary Setup

## Your Credentials
- **Cloud Name**: `dychd94d2`

## Quick Steps

1. **Create Upload Preset** (2 minutes):
   - Go to: https://console.cloudinary.com/settings/upload
   - Click "Add upload preset"
   - Name: `bavari-upload`
   - Signing mode: **Unsigned** ⚠️
   - Folder: `bavari-products` (optional)
   - Click "Save"

2. **Create `.env.local` file** in the `frontend` folder:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dychd94d2
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=bavari-upload
   ```

3. **Restart your dev server**:
   ```bash
   npm run dev
   ```

That's it! Image uploads will now work. 🎉

