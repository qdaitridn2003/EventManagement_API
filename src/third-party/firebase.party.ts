import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import bcrypt from 'bcrypt';
import { FirebaseConfigs } from '../configs';
import { uploadTypeHelper } from '../utils';

initializeApp(FirebaseConfigs);

const firebaseStorage = getStorage();

const firebaseParty = {
    uploadImage: async (file: Express.Multer.File, type: number): Promise<string> => {
        const hashImage = await bcrypt.hashSync(file.originalname, 0.1);
        const storagePath = uploadTypeHelper(type);
        const storageRef = ref(firebaseStorage, `${storagePath}/${hashImage}`);
        const metadata = { contentType: file.mimetype };
        const snapShot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const imageUrl = await getDownloadURL(snapShot.ref);
        return imageUrl;
    },
};

export default firebaseParty;
