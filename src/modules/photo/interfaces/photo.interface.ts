export interface IPhotoProps {
    id?: string;
    url: string;
    userId: string;
    uploadedAt?: Date;
    metadata?: Record<string, any>;
  }
  
  export interface IPhoto {
    id: string;
    url: string;
    userId: string;
    uploadedAt: Date;
    metadata?: Record<string, any>;
    
    validate(): boolean;
    updateMetadata(newMetadata: Record<string, any>): void;
    toObject(): IPhotoProps;
  }