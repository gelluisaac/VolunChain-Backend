import { UploadPhotoUseCase } from "../src/modules/photo/application/use-cases/UploadPhotoUseCase";
import { PhotoRepository } from "../src/repository/PhotoRepository";
import { PhotoUploadDTO } from "../src/dtos/PhotoUploadDTO";
import { Photo } from "../src/entities/Photo";

class MockPhotoRepository implements PhotoRepository {
async findAll(): Promise<Photo[]> {
    return this.photos;
}
  update(id: string, data: Partial<Photo>): Promise<Photo> {
      throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
      throw new Error("Method not implemented.");
  }
  private photos: Photo[] = [];

  async findById(id: string): Promise<Photo | null> {
    return this.photos.find(photo => photo.id === id) || null;
  }

  async create(data: Partial<Photo>): Promise<Photo> {
    const photo = new Photo(data);
    this.photos.push(photo);
    return photo;
  }
}

describe("UploadPhotoUseCase", () => {
  let useCase: UploadPhotoUseCase;
  let repository: MockPhotoRepository;

  beforeEach(() => {
    repository = new MockPhotoRepository();
    useCase = new UploadPhotoUseCase(repository);
  });

  it("should upload a valid photo successfully", async () => {
    const dto: PhotoUploadDTO = {
      userId: "user123",
      fileName: "photo.png",
      fileType: "image/png",
      fileSize: 1024 * 1024,
      fileData: Buffer.from("mock image data"),
    };

    const result = await useCase.execute(dto);

    expect(result.url).toBe(`/uploads/${dto.fileName}`);
    expect(result.userId).toBe(dto.userId);
  });

  it("should throw an error for file size exceeding the limit", async () => {
    const dto: PhotoUploadDTO = {
      userId: "user123",
      fileName: "large-photo.png",
      fileType: "image/png",
      fileSize: 6 * 1024 * 1024, // 6MB, exceeds limit
      fileData: Buffer.from("mock image data"),
    };

    await expect(useCase.execute(dto)).rejects.toThrow("File size exceeds limit.");
  });

  it("should throw an error for unsupported file format", async () => {
    const dto: PhotoUploadDTO = {
      userId: "user123",
      fileName: "photo.gif",
      fileType: "image/gif", // Unsupported format
      fileSize: 1024 * 1024,
      fileData: Buffer.from("mock image data"),
    };

    await expect(useCase.execute(dto)).rejects.toThrow("Unsupported file format.");
  });
});