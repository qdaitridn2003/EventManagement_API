import createHttpError from 'http-errors';
import multer from 'multer';

const imageHandler = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file: Express.Multer.File, callBack) => {
        const tailImageFile = file.mimetype.split('/')[1];
        if (tailImageFile === 'jpg' || tailImageFile === 'jpeg' || tailImageFile === 'png' || tailImageFile === 'svg') {
            callBack(null, true);
        } else {
            callBack(createHttpError(400, 'Image must have tail file (jpg, jpeg, png, or svg)'));
        }
    },
    limits: {
        fieldSize: 1024 * 10, //0.1MB 100KB
    },
});

export default imageHandler;
