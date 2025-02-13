const cloudinary = require('../config/cloudinary')

async function removeSong(audio_id, image_id) {
    const removeAudio = new Promise((resolve, reject) => {
        // console.log(audio_id)
        cloudinary.uploader.destroy(audio_id, {
            resource_type: 'video',
            type: 'upload',
        }, (error, result) => {
            if (error) {
                console.log(error)
                reject(new Error('Remove fail'))
            } else {
                if(result.result != 'ok') {
                    reject(new Error('Remove fail'))
                }
                resolve(result)
            }
        })
    })
    const removeThumnail = new Promise((resolve, reject) => {
        // console.log(image_id)
        cloudinary.uploader.destroy(image_id, {
            resource_type: 'image',
        }, (error, result) => {
            if (error) {
                console.log(error)
                reject(new Error('Remove fail'))
            } else {
                if(result.result != 'ok') {
                    reject(new Error('Remove fail'))
                }
                resolve(result)
            }
        })
        
    })

    try {
        const [audioResult, imageResult] = await Promise.all([removeAudio, removeThumnail])
        return {
            type: 'sucesss',
        }
    } catch(err) {
        console.log('Remove Song fail', err)
        throw new Error('Remove song fail')
    }
}

module.exports = removeSong