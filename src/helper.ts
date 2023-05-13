import {Bucket, Storage} from "@google-cloud/storage";
import UserModel from "./endpoints/User/UserModel";
import bcrypt from "bcryptjs";


export const createDefaultAdmin = async () => {
    const adminUser = await UserModel.findOne({username: 'admin'});
    if (!adminUser) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        await UserModel.create({
            username: 'admin',
            email: 'admin@mail.de',
            password: hashedPassword,
            isAdmin: true,
            isOrganizer: true
        }).then(() => {
            console.log('Admin user created');
        }).catch((error) => {
            console.error('Error creating admin user:', error);
        });
    } else {
        console.log('Admin user already exists');
    }
}

export const createDefaultOrganizer = async () => {
    const organizerUser = await UserModel.findOne({username: 'organizer'});
    if (!organizerUser) {
        const hashedPassword = await bcrypt.hash('organizer', 10);
        await UserModel.create({
            username: 'organizer',
            email: 'organizer@mail.de',
            password: hashedPassword,
            isAdmin: false,
            isOrganizer: true
        }).then(() => {
            console.log('Organizer user created');
        }).catch((error) => {
            console.error('Error creating organizer user:', error);
        });
    } else {
        console.log('Organizer user already exists');
    }
}

export const createDefaultUser = async () => {
    UserModel.findOne({username: 'user'}).then((user) => {
        if (!user) {
            const hashedPassword = bcrypt.hashSync('user', 10);
            UserModel.create({
                username: 'user',
                email: 'user@mail.de',
                password: hashedPassword,
                isAdmin: false,
                isOrganizer: false
            }).then(() => {
                console.log('User created');
            }).catch((error) => {
                console.error('Error creating user:', error);
            });
        } else {
            console.log('User already exists');
        }
    }).catch((error) => {
        console.error('Error creating user:', error);
    });
}
const setupGoogleStorageConnection = (): Bucket => {
    try {
        const gc = new Storage({
            keyFilename: './rare-style-385113-66aef184c962.json',
            projectId: "rare-style-385113"
        });
        return gc.bucket("bht-mmt-bucket");
    } catch (error) {
        console.error('Error connecting to Google Cloud Storage:', error);
        throw error;
    }

}

export const uploadImage = (image: string, imageName: string) => new Promise((resolve, reject) => {
    if (!image) {
        return reject("No image provided");
    }
    const base64EncodedImageString = image.split(';base64,').pop();

    if (!base64EncodedImageString) {
        return reject("No base64 encoded image string provided");
    }
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');
    const mmtbucket = setupGoogleStorageConnection();
    const blob = mmtbucket.file(imageName);
    const blobStream = blob.createWriteStream({
        resumable: false,
    });
    blobStream.on('finish', () => {
        const publicUrl = `https://storage.cloud.google.com/${mmtbucket.name}/${blob.name}`;
        return resolve(publicUrl);
    });
    blobStream.end(imageBuffer);
})
/*
app.post("/api/upload", (req: Request, res: Response) => {

    console.log(req.body);
    const {image , imageName} = req.body;
    const base64EncodedImageString = image.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');
    const blob = mmtbucket.file(imageName);
    const blobStream = blob.createWriteStream({
        resumable: false,
    });
    blobStream.on('finish', () => {
        const publicUrl = `https://storage.cloud.google.com/${mmtbucket.name}/${blob.name}`;
        //https://storage.cloud.google.com/bht-mmt-bucket/test-image.jpg
        res.status(200).send({ publicUrl });
    });
    blobStream.end(imageBuffer);
})
*/