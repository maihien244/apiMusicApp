const cloudinary = require('../config/cloudinary')

async function uploadBuffer(imageBuffer, audioBuffer) {
    const uploadImage = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "musicApp/thumnail" },
        (error, result) => {
            if(error) {
                console.log(error)
                reject(error)
            } else {
                resolve(result)
            }
        }
      )
      stream.end(imageBuffer);
    })
  
    const uploadAudio = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "musicApp/song" },
        (error, result) => {
            if(error) {
                console.log(error)
                reject(error)
            } else {
                resolve(result)
            }
        }
      );
      stream.end(audioBuffer)
    })

    try {
        const [imageResult, audioResult] = await Promise.all([uploadImage, uploadAudio]);
        // console.log(imageResult)
        // console.log(audioResult)
        return {
            image: imageResult.secure_url,
            image_id: imageResult.public_id,
            audio: audioResult.secure_url,
            audio_id: audioResult.public_id,
        }
    }catch (error) {
        throw new Error('Upload fail', error)
    }
  }

  
module.exports = uploadBuffer