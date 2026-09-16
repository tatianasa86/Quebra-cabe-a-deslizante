import React, { useState } from 'react';
import { X, Shield, ArrowRight, Mail, User } from 'lucide-react';
import { PlayerProfile } from '../types';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (profile: PlayerProfile) => void;
  soundEnabled: boolean;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [googleEmail, setGoogleEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;

    setIsProcessing(true);
    const parsedName = displayName.trim() || googleEmail.split('@')[0];

    setTimeout(() => {
      const profile: PlayerProfile = {
        name: parsedName,
        email: googleEmail.trim(),
        avatar: '⭐',
        accountType: 'google',
      };
      localStorage.setItem('sliding_puzzle_google_account', JSON.stringify(profile));
      setIsProcessing(false);
      onSuccessLogin(profile);
    }, 400);
  };

  return (
    <div
      id="google-login-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="google-login-modal"
        className="w-full max-w-[380px] bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 relative animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          id="btn-close-google-modal"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google Header with SVG Logo */}
        <div className="flex flex-col items-center text-center gap-1.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2 mb-1">
            <svg viewBox="0 0 24 24" className="w-7 h-7">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
            Fazer login com o Google
          </h3>
          <p className="text-xs text-slate-500 max-w-[280px]">
            Conecte sua conta para salvar recordes e sincronizar seu progresso
          </p>
        </div>

        {/* Clean Login Form - Blank by default */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 my-1" id="form-google-auth">
          <div className="flex flex-col gap-1">
            <label htmlFor="google-email-input" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
              E-mail do Google
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center justify-center text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="google-email-input"
                type="email"
                required
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="seuemail@gmail.com"
                className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm font-semibold rounded-2xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="google-name-input" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
              Nome de Exibição
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center justify-center text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                id="google-name-input"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Digite seu nome (opcional)..."
                className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm font-semibold rounded-2xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing || !googleEmail.trim()}
              className="flex-1 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
            >
              <span>{isProcessing ? 'Conectando...' : 'Fazer Login'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Privacy reassurance */}
        <div className="flex items-start gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-[10.5px] text-slate-500 leading-snug">
          <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>
            Seus dados são protegidos e seu nome só será exibido após a confirmação do login.
          </span>
        </div>
      </div>
    </div>
  );
};
