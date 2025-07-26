import React, { useState, useCallback } from 'react';
import { FileUploadZone } from '@/components/FileUploadZone';
import { ImagePreview } from '@/components/ImagePreview';
import { ConversionProgress } from '@/components/ConversionProgress';
import { Model3DViewer } from '@/components/Model3DViewer';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Globe, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import heroImage from '@/assets/hero-3d-conversion.jpg';

type ConversionState = 'idle' | 'uploading' | 'converting' | 'completed';

const Index = () => {
  const [conversionState, setConversionState] = useState<ConversionState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('upload');
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [conversionTime, setConversionTime] = useState(0);

  const handleFileUpload = useCallback((file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setConversionState('uploading');
  }, []);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
    setConversionState('idle');
    setProgress(0);
  }, [imageUrl]);

  const startConversion = useCallback(() => {
    if (!selectedFile) return;
    
    setConversionState('converting');
    setProgress(0);
    setCurrentStep('upload');
    
    const startTime = Date.now();
    
    // Simulate realistic conversion process
    const steps = [
      { step: 'upload', duration: 2000, progress: 20 },
      { step: 'ai-processing', duration: 8000, progress: 70 },
      { step: 'mesh-generation', duration: 5000, progress: 95 },
      { step: 'complete', duration: 1000, progress: 100 }
    ];
    
    let totalElapsed = 0;
    
    steps.forEach((stepData, index) => {
      setTimeout(() => {
        setCurrentStep(stepData.step);
        
        // Animate progress for this step
        const stepStart = index === 0 ? 0 : steps[index - 1].progress;
        const stepEnd = stepData.progress;
        const stepDuration = stepData.duration;
        const stepStartTime = Date.now();
        
        const animateProgress = () => {
          const elapsed = Date.now() - stepStartTime;
          const stepProgress = Math.min(elapsed / stepDuration, 1);
          const currentProgress = stepStart + (stepEnd - stepStart) * stepProgress;
          
          setProgress(currentProgress);
          
          // Update estimated time
          const totalElapsedSeconds = (Date.now() - startTime) / 1000;
          const remainingSteps = steps.slice(index + 1);
          const remainingTime = remainingSteps.reduce((sum, s) => sum + s.duration, 0) / 1000;
          setEstimatedTime(Math.max(0, Math.round(remainingTime * (1 - stepProgress))));
          
          if (stepProgress < 1) {
            requestAnimationFrame(animateProgress);
          } else if (stepData.step === 'complete') {
            const totalTime = Math.round((Date.now() - startTime) / 1000);
            setConversionTime(totalTime);
            setConversionState('completed');
            toast.success('3D model generated successfully!');
          }
        };
        
        animateProgress();
      }, totalElapsed);
      
      totalElapsed += stepData.duration;
    });
  }, [selectedFile]);

  const handleDownload = useCallback((format: string) => {
    // Simulate file download
    const blob = new Blob(['Mock 3D model data'], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile?.name?.split('.')[0] || 'model'}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleStartOver = useCallback(() => {
    handleRemoveFile();
    setProgress(0);
    setCurrentStep('upload');
    setEstimatedTime(15);
    setConversionTime(0);
  }, [handleRemoveFile]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">AI-Powered 3D Generation</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-center max-w-4xl mx-auto leading-tight">
              Transform{" "}
              <span className="text-primary neon-text">2D Images</span>
              {" "}into{" "}
              <span className="text-secondary neon-text">3D Models</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload any 2D image and watch our advanced AI models generate stunning 3D objects 
              ready for web, AR, and 3D printing applications.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-accent" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-accent" />
                <span>Web Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-accent" />
                <span>Multiple Formats</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Application */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Zone */}
          {conversionState === 'idle' && (
            <FileUploadZone
              onFileUpload={handleFileUpload}
              isUploading={false}
            />
          )}

          {/* Image Preview */}
          <ImagePreview
            file={selectedFile}
            imageUrl={imageUrl}
            onRemove={handleRemoveFile}
            isVisible={conversionState === 'uploading'}
          />

          {/* Start Conversion Button */}
          {conversionState === 'uploading' && (
            <div className="text-center animate-fade-in">
              <Button
                onClick={startConversion}
                size="lg"
                className="glass-hover neon-glow px-8 py-4 text-lg font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate 3D Model
              </Button>
            </div>
          )}

          {/* Conversion Progress */}
          <ConversionProgress
            isVisible={conversionState === 'converting'}
            progress={progress}
            currentStep={currentStep}
            estimatedTime={estimatedTime}
            fileName={selectedFile?.name || ''}
          />

          {/* 3D Model Viewer */}
          <Model3DViewer
            isVisible={conversionState === 'completed'}
            fileName={selectedFile?.name || ''}
            onDownload={handleDownload}
            conversionTime={conversionTime}
          />

          {/* Start Over Button */}
          {conversionState === 'completed' && (
            <div className="text-center animate-fade-in">
              <Button
                onClick={handleStartOver}
                variant="outline"
                size="lg"
                className="glass-hover"
              >
                Convert Another Image
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Why Choose Our 3D Converter?</h2>
            <p className="text-muted-foreground">Advanced AI technology meets intuitive design</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-6 text-center space-y-4 glass-hover">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Ultra Fast Processing</h3>
              <p className="text-muted-foreground">
                Generate high-quality 3D models in under 30 seconds using our optimized AI pipeline.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center space-y-4 glass-hover">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Web Ready Formats</h3>
              <p className="text-muted-foreground">
                Download models in GLB, OBJ, and USDZ formats for web, desktop, and AR applications.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center space-y-4 glass-hover">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">AI-Powered Quality</h3>
              <p className="text-muted-foreground">
                State-of-the-art neural networks ensure accurate depth estimation and mesh generation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;