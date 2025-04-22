// src/modules/photo/__tests__/domain/photo.entity.test.ts

import { Photo } from "../entities/photo.entity";

describe("Photo Entity", () => {
  const validPhotoProps = {
    url: "https://example.com/photo.jpg",
    userId: "user-123",
  };

  describe("Creation", () => {
    it("should create a photo with valid props", () => {
      const photo = Photo.create(validPhotoProps);

      expect(photo).toBeInstanceOf(Photo);
      expect(photo.url).toBe(validPhotoProps.url);
      expect(photo.userId).toBe(validPhotoProps.userId);
      expect(photo.id).toBeDefined();
      expect(photo.uploadedAt).toBeInstanceOf(Date);
    });

    it("should accept optional metadata", () => {
      const photoWithMetadata = Photo.create({
        ...validPhotoProps,
        metadata: { size: "1024kb", format: "jpg" },
      });

      expect(photoWithMetadata.metadata).toEqual({ size: "1024kb", format: "jpg" });
    });
  });

  describe("Validation", () => {
    it("should validate a photo with all required fields", () => {
      const photo = new Photo(validPhotoProps);
      expect(photo.validate()).toBe(true);
    });

    it("should throw an error when URL is missing", () => {
      const photo = new Photo({
        ...validPhotoProps,
        url: "",
      });

      expect(() => photo.validate()).toThrow("Photo URL is required");
    });

    it("should throw an error when URL is invalid", () => {
      const photo = new Photo({
        ...validPhotoProps,
        url: "invalid-url",
      });

      expect(() => photo.validate()).toThrow("Photo URL must be a valid HTTP/HTTPS URL");
    });

    it("should throw an error when userId is missing", () => {
      const photo = new Photo({
        ...validPhotoProps,
        userId: "",
      });

      expect(() => photo.validate()).toThrow("User ID is required");
    });
  });

  describe("updateMetadata", () => {
    it("should merge new metadata with existing metadata", () => {
      const photo = Photo.create({
        ...validPhotoProps,
        metadata: { size: "1024kb" },
      });

      photo.updateMetadata({ format: "jpg" });
      expect(photo.metadata).toEqual({ size: "1024kb", format: "jpg" });
    });

    it("should create metadata object if it was undefined", () => {
      const photo = Photo.create(validPhotoProps);
      photo.updateMetadata({ width: 800, height: 600 });
      
      expect(photo.metadata).toEqual({ width: 800, height: 600 });
    });
  });

  describe("toObject", () => {
    it("should convert entity to plain object", () => {
      const photo = Photo.create(validPhotoProps);
      const plainObject = photo.toObject();
      
      expect(plainObject).toEqual({
        id: photo.id,
        url: photo.url,
        userId: photo.userId,
        uploadedAt: photo.uploadedAt,
        metadata: undefined,
      });
    });
  });
});