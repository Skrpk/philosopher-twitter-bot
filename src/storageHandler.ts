import { Auth, drive_v3, sheets_v4 } from 'googleapis';

const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

export type Qoute = {
  text: string;
  author: string;
};

export type StoreType = {
  imgIndex: number;
  quotesIndex: number;
};

export type GetQuoteReturnType = { quotes: Qoute[]; quotesListLength: number };

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
      scopes: [GOOGLE_DRIVE_SCOPE, GOOGLE_SHEETS_SCOPE],
    });
  }

  async getQuotes(): Promise<GetQuoteReturnType> {
    try {
      const sheets = new sheets_v4.Sheets({
        auth: this.auth,
      });
      const {
        data: { values },
      } = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_QUOTES_ID,
        range: 'A:B',
      });
      values.shift();

      return {
        quotes: values.map(([text, author]) => ({ text, author })),
        quotesListLength: values.length,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getFile<T>(fileId: string) {
    const driveService = new drive_v3.Drive({
      auth: this.auth,
    });

    try {
      return (
        await driveService.files.get({
          fileId,
          alt: 'media',
        })
      ).data as T;
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

  async populateQuotesToSheets(quotes: Qoute[]) {
    const sheets = new sheets_v4.Sheets({
      auth: this.auth,
    });
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_QUOTES_ID,
      range: 'A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: quotes.map(({ text, author }) => [text, author]),
      },
    });
    console.log('Completed populating quotes to sheets');
  }

  async getStore(): Promise<StoreType> {
    const sheets = new sheets_v4.Sheets({
      auth: this.auth,
    });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_STORE_ID,
      range: 'A2:B2',
    });

    const [[imgIndex, quotesIndex]] = res.data.values;
    console.log('Completed getting store', imgIndex, quotesIndex);
    return {
      imgIndex: Number(imgIndex),
      quotesIndex: Number(quotesIndex),
    };
  }

  async setStore(store: StoreType) {
    const sheets = new sheets_v4.Sheets({
      auth: this.auth,
    });
    sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEETS_STORE_ID,
      range: 'A2:B2',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[store.imgIndex, store.quotesIndex]],
      },
    });
  }
}
