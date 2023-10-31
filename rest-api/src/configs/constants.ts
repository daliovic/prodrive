import { existsSync, mkdirSync } from 'fs';

export class CONSTANTS {
  private static _filesUploadDir = process.env.NODE_ENV === 'development' ? './public/uploads/files' : `./public/uploads/files`;

  public static get filesUploadDir(): string {
    if (!existsSync(this._filesUploadDir)) {
      mkdirSync(this._filesUploadDir, { recursive: true });
    }

    return this._filesUploadDir;
  }
}
