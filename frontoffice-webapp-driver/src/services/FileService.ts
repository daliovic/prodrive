import config from "../configs/config.json";


export class FileService {
    getFile(name: string) {
        return `${config.SERVER_URL}/files/${name}`;
    }
}
