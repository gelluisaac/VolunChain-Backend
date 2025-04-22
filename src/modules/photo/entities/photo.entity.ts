// src/modules/photo/domain/entities/photo.entity.ts

export interface PhotoProps {
    id?: string;
    url: string;
    userId: string;
    uploadedAt?: Date;
    metadata?: Record<string, any>;
  }
  
  export class Photo {
    private _id: string;
    private _url: string;
    private _userId: string;
    private _uploadedAt: Date;
    private _metadata?: Record<string, any>;
  
    constructor(props: PhotoProps) {
      this._id = props.id || crypto.randomUUID();
      this._url = props.url;
      this._userId = props.userId;
      this._uploadedAt = props.uploadedAt || new Date();
      this._metadata = props.metadata;
    }
  
    // Getters
    get id(): string {
      return this._id;
    }
  
    get url(): string {
      return this._url;
    }
  
    get userId(): string {
      return this._userId;
    }
  
    get uploadedAt(): Date {
      return this._uploadedAt;
    }
  
    get metadata(): Record<string, any> | undefined {
      return this._metadata;
    }
  
    // Domain logic and validation
    validate(): boolean {
      if (!this._url || this._url.trim() === "") {
        throw new Error("Photo URL is required");
      }
      
      if (!/^https?:\/\/.+$/.test(this._url)) {
        throw new Error("Photo URL must be a valid HTTP/HTTPS URL");
      }
      
      if (!this._userId || this._userId.trim() === "") {
        throw new Error("User ID is required");
      }
      
      return true;
    }
  
    // Update metadata
    updateMetadata(newMetadata: Record<string, any>): void {
      this._metadata = {
        ...this._metadata,
        ...newMetadata
      };
    }
  
    // Static factory method
    static create(props: PhotoProps): Photo {
      const photo = new Photo(props);
      photo.validate();
      return photo;
    }
  
    // Convert to plain object for persistence
    toObject(): PhotoProps {
      return {
        id: this._id,
        url: this._url,
        userId: this._userId,
        uploadedAt: this._uploadedAt,
        metadata: this._metadata,
      };
    }
  }