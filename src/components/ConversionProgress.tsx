import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Zap, Brain, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversionStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  duration: number; // in seconds
}

const CONVERSION_STEPS: ConversionStep[] = [
  {
    id: 'upload',
    label: 'Image Analysis',
    icon: <Zap className="w-4 h-4" />,
    duration: 2
  },
  {
    id: 'ai-processing',
    label: 'AI Model Processing',
    icon: <Brain className="w-4 h-4" />,
    duration: 8
  },
  {
    id: 'mesh-generation',
    label: 'Mesh Generation',
    icon: <Box className="w-4 h-4" />,
    duration: 5
  },
  {
    id: 'complete',
    label: 'Ready for Download',
    icon: <CheckCircle className="w-4 h-4" />,
    duration: 1
  }
];

interface ConversionProgressProps {
  isVisible: boolean;
  progress: number;
  currentStep: string;
  estimatedTime: number;
  fileName: string;
}

export const ConversionProgress: React.FC<ConversionProgressProps> = ({
  isVisible,
  progress,
  currentStep,
  estimatedTime,
  fileName
}) => {
  if (!isVisible) return null;

  const currentStepIndex = CONVERSION_STEPS.findIndex(step => step.id === currentStep);

  return (
    <div className="glass rounded-2xl p-6 space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold neon-text">Converting to 3D</h3>
        <p className="text-muted-foreground text-sm">{fileName}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-primary font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="relative">
          <Progress value={progress} className="h-3 bg-muted/30" />
          <div 
            className="absolute top-0 left-0 h-3 rounded-full progress-glow transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {CONVERSION_STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div 
              key={step.id}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg transition-all duration-300",
                isActive && "bg-primary/10 border border-primary/20",
                isCompleted && "opacity-75",
                isPending && "opacity-50"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                isActive && "bg-primary neon-glow animate-pulse",
                isCompleted && "bg-accent",
                isPending && "bg-muted"
              )}>
                {step.icon}
              </div>
              
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium",
                  isActive && "text-primary neon-text",
                  isCompleted && "text-accent",
                  isPending && "text-muted-foreground"
                )}>
                  {step.label}
                </p>
              </div>

              {isActive && (
                <div className="text-xs text-primary">
                  {estimatedTime}s remaining
                </div>
              )}

              {isCompleted && (
                <CheckCircle className="w-4 h-4 text-accent" />
              )}
            </div>
          );
        })}
      </div>

      {/* Technical Info */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">Model</p>
          <p className="text-sm font-medium text-secondary">Shap-E v2.1</p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">Quality</p>
          <p className="text-sm font-medium text-secondary">High-Res</p>
        </div>
      </div>
    </div>
  );
};