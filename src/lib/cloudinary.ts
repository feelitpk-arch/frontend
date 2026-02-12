/**
 * Cloudinary Image Upload Utility
 * Uses Cloudinary's unsigned upload for free image storage
 * 
 * Setup:
 * 1. Create a free account at https://cloudinary.com
 * 2. Get your Cloud Name from the dashboard
 * 3. Create an upload preset (Settings > Upload > Upload presets > Add upload preset)
 * 4. Set the preset to "Unsigned" and save
 * 5. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.warn(
    '⚠️ Cloudinary configuration missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env.local file'
  );
}

export interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
}

/**
 * Upload an image file to Cloudinary
 * @param file - The image file to upload
 * @param folder - Optional folder path in Cloudinary (e.g., 'products')
 * @returns Promise with the uploaded image URL
 */
export async function uploadImageToCloudinary(
  file: File,
  folder: string = 'bavari-products'
): Promise<UploadResult> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env file.'
    );
  }

  // Log current configuration for debugging
  console.log('🔧 Cloudinary Config:', {
    cloudName: CLOUDINARY_CLOUD_NAME,
    preset: CLOUDINARY_UPLOAD_PRESET,
    hasCloudName: !!CLOUDINARY_CLOUD_NAME,
    hasPreset: !!CLOUDINARY_UPLOAD_PRESET
  });

  // Debug logging
  console.log('📤 Uploading to Cloudinary:', {
    cloudName: CLOUDINARY_CLOUD_NAME,
    preset: CLOUDINARY_UPLOAD_PRESET,
    folder,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (max 10MB for Cloudinary free tier)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 10MB');
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: response.statusText,
        error: { message: response.statusText }
      }));
      
      // Cloudinary returns errors in error.message format
      const errorMessage = errorData.error?.message || errorData.message || `Upload failed: ${response.statusText}`;
      
      console.error('❌ Cloudinary upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        preset: CLOUDINARY_UPLOAD_PRESET,
        cloudName: CLOUDINARY_CLOUD_NAME
      });

      // Provide helpful error message for common issues
      if (errorMessage.includes('preset not found') || errorMessage.includes('Upload preset not found')) {
        throw new Error(
          `Upload preset "${CLOUDINARY_UPLOAD_PRESET}" not found. Please create it in Cloudinary:\n` +
          `1. Go to: https://console.cloudinary.com/settings/upload\n` +
          `2. Click "Add upload preset"\n` +
          `3. Name: ${CLOUDINARY_UPLOAD_PRESET}\n` +
          `4. Signing mode: Unsigned\n` +
          `5. Save and restart your dev server`
        );
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Cloudinary returns URLs in format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}
    // Example: https://res.cloudinary.com/dychd94d2/image/upload/v1767105760/Featured_icon_udd5n1.svg
    const secureUrl = data.secure_url || data.url;
    
    console.log('✅ Upload successful:', {
      secureUrl,
      publicId: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
      bytes: data.bytes
    });
    
    return {
      url: data.url,
      secureUrl: secureUrl,
      publicId: data.public_id,
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of image files to upload
 * @param folder - Optional folder path in Cloudinary
 * @returns Promise with array of uploaded image URLs
 */
export async function uploadMultipleImagesToCloudinary(
  files: File[],
  folder: string = 'bavari-products'
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadImageToCloudinary(file, folder));
  return Promise.all(uploadPromises);
}

