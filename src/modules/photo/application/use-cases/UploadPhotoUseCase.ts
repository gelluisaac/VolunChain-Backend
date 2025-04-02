// src/modules/photo/application/use-cases/UploadPhotoUseCase.ts
import { PhotoUploadDTO } from "@/dtos/PhotoUploadDTO";
import { Photo } from "@/entities/Photo";
import { PhotoRepository } from "@/repository/PhotoRepository";
import { v4 as uuidv4 } from "uuid";

export class UploadPhotoUseCase {
  constructor(private readonly photoRepository: PhotoRepository) {}

  async execute(dto: PhotoUploadDTO): Promise<Photo> {
    if (dto.fileSize > 5 * 1024 * 1024) {
      throw new Error("File size exceeds limit.");
    }

    if (!["image/jpeg", "image/png"].includes(dto.fileType)) {
      throw new Error("Unsupported file format.");
    }

    const photo = new Photo({
      id: uuidv4(),
      url: `/uploads/${dto.fileName}`, 
      userId: dto.userId,
      uploadedAt: new Date(),
      metadata: { fileType: dto.fileType, fileSize: dto.fileSize },
    });

    await this.photoRepository.create(photo);
    return photo;
  }
}