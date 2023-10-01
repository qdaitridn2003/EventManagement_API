import bcrypt from 'bcrypt';

const hashPasswordHandler = {
    hashPassword: (password: string) => {
        const saltRound = bcrypt.genSaltSync(1);
        const hashPassword = bcrypt.hashSync(password, saltRound);
        return hashPassword;
    },
    comparePassword: (password: string, hashPassword: string) => {
        const resultCompare = bcrypt.compareSync(password, hashPassword);
        return resultCompare;
    },
};

export default hashPasswordHandler;
