// Interfaz para el servicio de almacenamiento
export interface StorageService {
    uploadFile(file: Express.Multer.File, path: string): Promise<string>;
    uploadBuffer(
        buffer: Buffer,
        path: string,
        options?: {
            fileName?: string;
            contentType?: string;
            extension?: string;
        },
    ): Promise<string>;
    // deleteFile(path: string): Promise<void>;
    // getFile(path: string): Promise<string>;
    // getFileUrl(path: string): Promise<string>;
    // getFileBuffer(path: string): Promise<Buffer>;
}