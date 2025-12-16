import { useState } from 'react';
import { Upload, X, Loader2, Image } from 'lucide-react';

const ImageUpload = ({ onImageSelect, onUploadComplete, disabled }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const CLOUD_NAME = "dzkjoguoc";
  const PRESET_NAME = "ml_default";

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', PRESET_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        onUploadComplete(data.secure_url);
      } else {
        throw new Error('No se recibió URL de la imagen');
      }
    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      alert('Error al subir la imagen. Intenta de nuevo.');
      setPreview(null);
      onUploadComplete(null);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onUploadComplete(null);
  };

  return (
    <div className="relative">
      {preview && (
        <div className="mb-4 relative inline-block">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-48 h-48 object-cover rounded-lg shadow-lg border-2 border-slate-200 hover:shadow-xl transition-shadow"
          />
          <button
            type="button"
            onClick={clearImage}
            disabled={uploading}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-lg w-8 h-8 flex items-center justify-center hover:bg-red-700 shadow-lg border-2 border-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {!preview && (
        <label className={`block cursor-pointer transition-all ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
          />
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-indigo-400 hover:bg-slate-100 transition-all min-h-[160px] flex flex-col items-center justify-center text-center gap-4">
            
            {uploading ? (
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              </div>
            ) : (
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Image className="w-10 h-10 text-indigo-600" />
              </div>
            )}
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                {uploading ? 'Subiendo...' : 'Adjuntar Imagen'}
              </h3>
              <p className="text-sm text-slate-600">
                {uploading ? 'Procesando tu imagen...' : 'PNG, JPG hasta 5MB'}
              </p>
            </div>
            
            {uploading && (
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </label>
      )}
      
      <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
        <span>Máximo 5MB • PNG/JPG • Alta resolución recomendada</span>
      </div>
    </div>
  );
};

export default ImageUpload;