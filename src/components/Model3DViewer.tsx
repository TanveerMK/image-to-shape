import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment } from '@react-three/drei';
import { Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Sample 3D model component
function SampleModel({ modelPath }: { modelPath: string }) {
  const meshRef = useRef<any>();
  const [hovered, setHovered] = useState(false);
  
  // Auto-rotate when not being controlled
  useFrame((state, delta) => {
    if (meshRef.current && !hovered) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // For demo purposes, we'll create a procedural model
  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => setHovered(true)}
      onPointerOut={(e) => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color={hovered ? "#a855f7" : "#3b82f6"} 
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading 3D model...</p>
      </div>
    </Html>
  );
}

interface Model3DViewerProps {
  modelPath?: string;
  isVisible: boolean;
  fileName: string;
  onDownload: (format: string) => void;
  conversionTime: number;
}

export const Model3DViewer: React.FC<Model3DViewerProps> = ({
  modelPath,
  isVisible,
  fileName,
  onDownload,
  conversionTime
}) => {
  const [controlsRef, setControlsRef] = useState<any>(null);

  const resetCamera = () => {
    if (controlsRef) {
      controlsRef.reset();
      toast.info('Camera view reset');
    }
  };

  const handleDownload = (format: string) => {
    onDownload(format);
    toast.success(`Downloading ${format.toUpperCase()} file...`);
  };

  if (!isVisible) return null;

  return (
    <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold neon-text">3D Model Preview</h3>
          <p className="text-sm text-muted-foreground">{fileName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Conversion Time</p>
          <p className="text-sm font-medium text-accent">{conversionTime}s</p>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/5 border border-border/50">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          
          <Suspense fallback={<LoadingFallback />}>
            <SampleModel modelPath={modelPath || ''} />
            <Environment preset="studio" />
          </Suspense>
          
          <OrbitControls 
            ref={setControlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
        </Canvas>

        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="glass-hover w-10 h-10 p-0"
            onClick={resetCamera}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-black/50 px-3 py-2 rounded-lg">
          Click and drag to rotate • Scroll to zoom • Right-click to pan
        </div>
      </div>

      {/* Model Info */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Vertices</p>
          <p className="text-sm font-medium text-foreground">2,847</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Faces</p>
          <p className="text-sm font-medium text-foreground">5,694</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Size</p>
          <p className="text-sm font-medium text-foreground">1.2 MB</p>
        </div>
      </div>

      {/* Download Options */}
      <div className="space-y-3">
        <h4 className="text-lg font-medium text-foreground">Download 3D Model</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={() => handleDownload('glb')}
            className="glass-hover flex items-center justify-center space-x-2 h-12"
            variant="outline"
          >
            <Download className="w-4 h-4" />
            <div className="text-left">
              <p className="text-sm font-medium">GLB</p>
              <p className="text-xs text-muted-foreground">Best for web</p>
            </div>
          </Button>
          
          <Button
            onClick={() => handleDownload('obj')}
            className="glass-hover flex items-center justify-center space-x-2 h-12"
            variant="outline"
          >
            <Download className="w-4 h-4" />
            <div className="text-left">
              <p className="text-sm font-medium">OBJ</p>
              <p className="text-xs text-muted-foreground">Universal format</p>
            </div>
          </Button>
          
          <Button
            onClick={() => handleDownload('usdz')}
            className="glass-hover flex items-center justify-center space-x-2 h-12"
            variant="outline"
          >
            <Download className="w-4 h-4" />
            <div className="text-left">
              <p className="text-sm font-medium">USDZ</p>
              <p className="text-xs text-muted-foreground">iOS AR ready</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};