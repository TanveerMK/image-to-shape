import React from 'react';
import { X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  file: File | null;
  imageUrl: string | null;
  onRemove: () => void;
  isVisible: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  imageUrl,
  onRemove,
  isVisible
}) => {
  if (!isVisible || !file || !imageUrl) return null;

  return (
    <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <FileImage className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Source Image</h3>
            <p className="text-sm text-muted-foreground">{file.name}</p>
          </div>
        </div>
        
        <Button
          onClick={onRemove}
          size="sm"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-border/50 bg-muted/10">
        <img 
          src={imageUrl} 
          alt="Uploaded preview" 
          className="w-full max-h-[300px] object-contain"
        />
        
        {/* Image overlay info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex justify-between items-end text-white text-sm">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-white/70">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div className="text-right">
              <p className="text-white/70">Ready for conversion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};