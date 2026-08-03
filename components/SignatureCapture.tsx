import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Upload, Check } from 'lucide-react';

interface SignatureCaptureProps {
  label: string;
  value?: string;
  onChange: (dataUrl: string) => void;
}

export const SignatureCapture: React.FC<SignatureCaptureProps> = ({ label, value, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!value);
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  
  useEffect(() => {
    if (value && canvasRef.current && mode === 'draw') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = value;
      }
    }
  }, [value, mode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    setHasSignature(true);
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveSignature();
    }
  };
  
  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onChange(dataUrl);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setHasSignature(false);
      onChange('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
          setHasSignature(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60">
          {label} Signature
        </label>
        <div className="flex bg-[#F4F1EE] dark:bg-[#2A2A2A] border border-black/20 dark:border-white/20">
          <button 
            type="button"
            onClick={() => setMode('draw')}
            className={`px-2 py-1 text-[9px] font-bold uppercase transition-colors ${mode === 'draw' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/60 dark:text-white/60'}`}
          >
            Draw
          </button>
          <button 
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-1 text-[9px] font-bold uppercase transition-colors ${mode === 'upload' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/60 dark:text-white/60'}`}
          >
            Upload
          </button>
        </div>
      </div>
      
      {mode === 'draw' ? (
        <div className="relative border border-black/20 dark:border-white/20 bg-white rounded-none">
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="w-full h-[150px] cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {hasSignature && (
            <button
              type="button"
              onClick={clearSignature}
              className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 transition-colors"
              title="Clear Signature"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="border border-black/20 dark:border-white/20 bg-white p-4 h-[150px] flex flex-col items-center justify-center relative">
          {value ? (
            <>
              <img src={value} alt={`${label} Signature`} className="max-h-full max-w-full object-contain" />
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setHasSignature(false);
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 transition-colors"
                title="Clear Signature"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer h-full w-full">
              <Upload className="w-6 h-6 text-black/40 dark:text-white/40 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-black/60">Upload Image</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
};
