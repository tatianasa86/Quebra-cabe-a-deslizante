import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

interface CustomPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyImage: (imageUrl: string, themeName: string) => void;
}

export const CustomPhotoModal: React.FC<CustomPhotoModalProps> = ({
  isOpen,
  onClose,
  onApplyImage,
}) => {
  const [tab, setTab] = useState<'url' | 'upload'>('url');
  const [directUrl, setDirectUrl] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleApplyUrl = () => {
    if (!directUrl.trim()) return;
    onApplyImage(directUrl.trim(), 'Imagem Direta');
    onClose();
  };

  const handleFileUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onApplyImage(result, 'Foto Personalizada');
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      id="custom-photo-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="custom-photo-modal"
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Personalizar Imagem</h3>
              <p className="text-xs text-slate-500 font-medium">Link direto ou foto do dispositivo</p>
            </div>
          </div>
          <button
            type="button"
            id="close-custom-photo-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
          <button
            type="button"
            id="tab-direct-link"
            onClick={() => setTab('url')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'url'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Link Direto (URL)</span>
          </button>
          <button
            type="button"
            id="tab-upload-file"
            onClick={() => setTab('upload')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'upload'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Carregar Foto</span>
          </button>
        </div>

        {/* Tab Content: Direct Link */}
        {tab === 'url' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="direct-image-url" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                URL Direta da Imagem
              </label>
              <input
                id="direct-image-url"
                type="url"
                value={directUrl}
                onChange={(e) => {
                  setDirectUrl(e.target.value);
                  setPreviewError(false);
                }}
                placeholder="Cole o link da imagem (ex: https://site.com/foto.jpg)"
                className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs font-medium rounded-xl px-3.5 py-3 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>

            {/* URL Live Preview */}
            {directUrl.trim() && (
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative flex items-center justify-center">
                {previewError ? (
                  <div className="text-center p-3 text-red-500 text-xs font-semibold flex flex-col items-center gap-1">
                    <ImageIcon className="w-6 h-6 text-red-400" />
                    <span>Não foi possível carregar a prévia deste link. Verifique se a URL termina em .jpg, .png ou permite carregamento direto.</span>
                  </div>
                ) : (
                  <img
                    src={directUrl}
                    alt="Prévia do link direto"
                    onError={() => setPreviewError(true)}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            <button
              type="button"
              id="apply-direct-url-btn"
              disabled={!directUrl.trim() || previewError}
              onClick={handleApplyUrl}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>Aplicar Esta Imagem</span>
            </button>
          </div>
        )}

        {/* Tab Content: Upload File */}
        {tab === 'upload' && (
          <div className="flex flex-col gap-3">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50'
              }`}
              onClick={() => document.getElementById('modal-file-input')?.click()}
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-blue-600">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Arraste uma foto aqui ou clique para selecionar</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Formatos suportados: PNG, JPG, WebP</p>
              </div>
              <input
                id="modal-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
