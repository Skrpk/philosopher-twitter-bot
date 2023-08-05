import { google, Auth, drive_v3 } from 'googleapis';

const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';

export class StorageHandler {
  private auth: Auth.GoogleAuth;
  constructor() {
    this.auth = new Auth.GoogleAuth({
      credentials: {
        private_key: process.env.GOOGLE_DRIVE_API_PRIVATE_KEY.replace(
          /\\n/g,
          '\n'
        ),
        client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
      },
      scopes: [GOOGLE_DRIVE_SCOPE],
    });
  }

  async getFile(fileId: string) {
    const driveService = new drive_v3.Drive({
      auth: this.auth,
    });

    try {
      return await driveService.files.get({
        fileId,
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async list() {
    const driveService = new drive_v3.Drive({
      auth: this.auth,
    });

    try {
      const res = await driveService.files.list({
        q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`,
      });
      return res.data.files;
    } catch (err) {
      throw new Error(err);
    }
  }
}
