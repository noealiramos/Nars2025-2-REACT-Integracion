import { Readable } from 'stream';
import cloudinary, { hasCloudinaryConfig } from '../config/cloudinary.js';

const uploadBufferToCloudinary = (buffer, folder) => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder,
      resource_type: 'image',
    },
    (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    }
  );

  Readable.from(buffer).pipe(uploadStream);
});

export const uploadImage = async (req, res, next) => {
  try {
    if (!hasCloudinaryConfig) {
      return res.status(503).json({ message: 'Cloudinary is not configured on the server' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'An image file is required' });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, 'ramdi-jewelry/products');

    return res.status(201).json({
      data: {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    return next(error);
  }
};
