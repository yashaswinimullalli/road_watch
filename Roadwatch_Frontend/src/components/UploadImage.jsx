import { UploadCloud, Camera, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function UploadImage({ onImageSet }) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (onImageSet) onImageSet(url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setIsCameraActive(true);
      streamRef.current = stream;
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please ensure permissions are granted in your browser settings.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreviewUrl(dataUrl);
      if (onImageSet) onImageSet(dataUrl);
      stopCamera();
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    if (onImageSet) onImageSet(null);
  };

  if (isCameraActive) {
    return (
      <div className="relative w-full h-72 bg-black rounded-xl overflow-hidden flex flex-col items-center animate-fade-in shadow-xl shadow-black/50 border border-slate-200 dark:border-white/10">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 top-4 px-4 flex justify-between items-center z-10">
          <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium text-white flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            Camera Active
          </div>
          <button 
            type="button"
            onClick={stopCamera}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <div className="p-1.5 rounded-full border-2 border-white/50 backdrop-blur-md">
            <button 
              type="button"
              onClick={captureImage}
              className="w-14 h-14 rounded-full bg-white hover:bg-slate-200 transition-colors shadow-lg active:scale-95"
            ></button>
          </div>
        </div>
      </div>
    );
  }

  if (previewUrl) {
    return (
      <div className="relative w-full h-64 rounded-xl overflow-hidden group border border-slate-200 dark:border-white/10">
        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-300">
          <button 
            type="button"
            onClick={clearImage}
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-all active:scale-95 shadow-xl"
          >
            <X className="w-4 h-4" /> Remove Image
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div 
        className={`relative w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 bg-white dark:bg-slate-800/50 ${
          dragActive 
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/20 scale-[1.02] shadow-sm' 
            : 'border-slate-300 dark:border-slate-600 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          accept="image/*"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center gap-3 text-center pointer-events-none p-4">
          <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-slate-800 flex items-center justify-center border border-brand-100 dark:border-slate-700 shadow-sm transition-colors group-hover:bg-brand-100 dark:group-hover:bg-slate-700">
            <UploadCloud className={`w-6 h-6 ${dragActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 group-hover:text-brand-500'}`} />
          </div>
          <div>
            <p className="text-slate-700 dark:text-slate-200 font-medium mb-1">
              <span className="text-brand-600 dark:text-brand-400 font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-xs">SVG, PNG, JPG or GIF (max. 10MB)</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
        <span className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider">OR</span>
        <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
      </div>

      <button 
        type="button"
        onClick={startCamera}
        className="w-full py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        <Camera className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        Take a Photo
      </button>
    </div>
  );
}
