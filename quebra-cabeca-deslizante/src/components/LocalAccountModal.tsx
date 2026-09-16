import React, { useState, useEffect } from 'react';
import { X, User, HardDrive, Check, Sparkles } from 'lucide-react';
import { PlayerProfile } from '../types';

interface LocalAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAccount: (profile: PlayerProfile) => void;
}

const AVATAR_LIST = ['🦊', '🐱', '🐶', '🐼', '🐯', '🦁', '🚀', '🌟', '🎯', '👑', '⚡', '🎮'];

export const LocalAccountModal: React.FC<LocalAccountModalProps> = ({
  isOpen,
  onClose,
  onSaveAccount,
}) => {
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');

  useEffect(() => {
    if (isOpen) {
      setNickname('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nickname.trim();
    if (!finalName) return;

    const profile: PlayerProfile = {
      name: finalName,
      avatar: selectedAvatar,
      accountType: 'local',
    };
    localStorage.setItem('sliding_puzzle_local_profile', JSON.stringify(profile));
    onSaveAccount(profile);
  };

  return (
    <div
      id="local-account-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="local-account-modal"
        className="w-full max-w-[390px] bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 relative animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          id="btn-close-local-modal"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center gap-1.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 shadow-xs border border-emerald-100 flex items-center justify-center mb-1">
            <HardDrive className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
            Criar Conta Local
          </h3>
          <p className="text-xs text-slate-500 max-w-[290px]">
            Crie seu perfil no navegador para gravar seu histórico e recordes neste dispositivo
          </p>
        </div>

        {/* Creation Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" id="form-create-local-account">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="local-nickname-input"
              className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1"
            >
              Apelido do Perfil
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center justify-center text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                id="local-nickname-input"
                type="text"
                required
                maxLength={20}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Digite seu nome ou apelido..."
                className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm font-semibold rounded-2xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* Avatar selector */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
              Escolha seu Avatar
            </span>
            <div className="grid grid-cols-6 gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-200/60">
              {AVATAR_LIST.map((emoji) => {
                const isSelected = emoji === selectedAvatar;
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(emoji)}
                    className={`h-9 flex items-center justify-center rounded-xl text-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-2 border-emerald-500 shadow-sm scale-105'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feature highlights */}
          <div className="flex items-center gap-2 px-2 text-[11px] text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>Nenhum e-mail ou senha necessários. Dados 100% offline.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="btn-confirm-create-local-account"
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <Check className="w-4 h-4" />
            <span>Criar e Jogar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
