import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Validate environment variables
function validateCloudinaryConfig() {
  if (!process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Missing Cloudinary configuration. Please check your .env.local file.')
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate Cloudinary configuration
    validateCloudinaryConfig()

    // Parse the multipart form data
    const formData = await request.formData()
    const image = formData.get('image') as File | null
    const name = formData.get('name') as string | null
    const location = formData.get('location') as string
    const description = formData.get('description') as string

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (image.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary with transformations
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'proof-of-stake/submissions',
          // Automatic format and quality optimization
          fetch_format: 'auto',
          quality: 'auto',
          // Generate transformations
          eager: [
            {
              // Leaderboard thumbnail: 1000x1000 square for aspect-square grid
              width: 1000,
              height: 1000,
              crop: 'fill',
              gravity: 'auto',
              quality: 'auto',
              fetch_format: 'auto',
            },
            {
              // Analysis image: max 1024 on longest side, no distortion
              width: 1024,
              height: 1024,
              crop: 'limit',  // Fits within bounds without cropping or distortion
              quality: 'auto',
              fetch_format: 'auto',
            },
          ],
          // Add metadata
          context: {
            name: name || 'Untitled',
            location: location,
            description: description,
          },
          // Generate a unique filename
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      uploadStream.end(buffer)
    })

    // Extract URLs for different sizes
    const originalUrl = uploadResult.secure_url
    const leaderboardUrl = uploadResult.eager?.[0]?.secure_url || originalUrl // 1000x1000 square
    const analysisUrl = uploadResult.eager?.[1]?.secure_url || originalUrl // max 1024, no distortion

    // Return the uploaded image data
    return NextResponse.json({
      success: true,
      data: {
        publicId: uploadResult.public_id,
        originalUrl,
        leaderboardUrl,
        analysisUrl,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        metadata: {
          name: name || 'Untitled',
          location,
          description,
        },
      },
    })
  } catch (error) {
    console.error('Upload error:', error)

    return NextResponse.json(
      {
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Optional: Add a GET endpoint to check API status
export async function GET() {
  try {
    validateCloudinaryConfig()
    return NextResponse.json({
      status: 'ok',
      message: 'Upload API is ready'
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Configuration error'
      },
      { status: 500 }
    )
  }
}
