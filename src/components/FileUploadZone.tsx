import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, FileX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  className?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileUpload,
  isUploading,
  className
}) => {
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File too large. Please select an image under 10MB.');
        return;
      }
      onFileUpload(file);
      toast.success(`${file.name} uploaded successfully!`);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  React.useEffect(() => {
    if (fileRejections.length > 0) {
      toast.error('Please select a valid image file (PNG, JPG, GIF, etc.)');
    }
  }, [fileRejections]);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "upload-zone",
        "relative min-h-[300px] rounded-2xl p-8 cursor-pointer transition-all duration-300",
        "flex flex-col items-center justify-center space-y-4",
        "border-2 border-dashed",
        isDragActive && "active",
        isUploading && "pointer-events-none opacity-50",
        className
      )}
    >
      <input {...getInputProps()} />
      
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            {isUploading ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : isDragActive ? (
              <FileX className="w-8 h-8 text-primary animate-pulse" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </div>
          {!isUploading && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <Image className="w-3 h-3 text-accent-foreground" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold neon-text">
            {isUploading 
              ? "Processing your image..." 
              : isDragActive 
                ? "Drop your image here" 
                : "Upload 2D Image"
            }
          </h3>
          
          {!isUploading && (
            <p className="text-muted-foreground text-sm max-w-md">
              Drag and drop your image here, or{" "}
              <span className="text-primary font-medium">click to browse</span>
              <br />
              Supports PNG, JPG, GIF (Max 10MB)
            </p>
          )}
        </div>

        {!isUploading && !isDragActive && (
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-muted/50 rounded-full">PNG</span>
            <span className="px-2 py-1 bg-muted/50 rounded-full">JPG</span>
            <span className="px-2 py-1 bg-muted/50 rounded-full">GIF</span>
            <span className="px-2 py-1 bg-muted/50 rounded-full">WebP</span>
          </div>
        )}
      </div>
    </div>
  );
};