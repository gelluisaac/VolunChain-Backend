// src/modules/photo/application/dtos/PhotoUploadDTO.ts
export interface PhotoUploadDTO {
    userId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileData: Buffer;
  }