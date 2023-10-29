import createHttpError from 'http-errors';
import multer from 'multer';

const imageHandler = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file: Express.Multer.File, callBack) => {
        const tailImageFile = file.mimetype.split('/')[1];
        if (
            tailImageFile === 'jpg' ||
            tailImageFile === 'jpeg' ||
            tailImageFile === 'png' ||
            tailImageFile === 'svg'
        ) {
            callBack(null, true);
        } else {
            callBack(createHttpError('Image must have tailfile (jpg, jpeg, png, or svg)'));
        }
    },
    limits: {
        fieldSize: 10 * 1000 * 1000, //10MB
    },
});

export default imageHandler;
