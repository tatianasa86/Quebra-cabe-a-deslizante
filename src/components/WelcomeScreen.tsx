import React, { useState } from 'react';
import { Volume2, VolumeX, Star, ArrowRight, User, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { PlayerProfile } from '../types';
import { GoogleLoginModal } from './GoogleLoginModal';
import { LocalAccountModal } from './LocalAccountModal';

interface WelcomeScreenProps {
  player: PlayerProfile;
  onUpdatePlayer: (profile: PlayerProfile) => void;
  onStartGame: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const AVATAR_OPTIONS = ['🚀', '🦁', '⚡', '🏝️', '👾'];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  player,
  onUpdatePlayer,
  onStartGame,
  soundEnabled,
  onToggleSound,
}) => {
  const [nickname, setNickname] = useState(player.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(player.avatar || '🚀');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isLocalModalOpen, setIsLocalModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nickname.trim();
    if (!finalName) return;
    onUpdatePlayer({ ...player, name: finalName, avatar: selectedAvatar });
    onStartGame();
  };

  const handleClearAccount = () => {
    setNickname('');
    onUpdatePlayer({ name: '', avatar: '🚀', accountType: undefined });
    try {
      localStorage.removeItem('sliding_puzzle_google_account');
      localStorage.removeItem('sliding_puzzle_local_profile');
    } catch {
      // ignore
    }
  };

  const handleGoogleSuccess = (googleProfile: PlayerProfile) => {
    setNickname(googleProfile.name);
    setSelectedAvatar(googleProfile.avatar);
    onUpdatePlayer(googleProfile);
    setIsGoogleModalOpen(false);
    onStartGame();
  };

  const handleLocalAccountSuccess = (localProfile: PlayerProfile) => {
    setNickname(localProfile.name);
    setSelectedAvatar(localProfile.avatar);
    onUpdatePlayer(localProfile);
    setIsLocalModalOpen(false);
    onStartGame();
  };

  return (
    <>
      <section
        id="welcome-screen"
        data-purpose="welcome-login-screen"
        className="w-full max-w-[390px] bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/80 flex flex-col gap-3 relative z-10 overflow-hidden transition-all"
      >
        {/* Decorative top background blur */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-100/60 blur-xl pointer-events-none" />

        {/* Top Bar: Pro Badge & Sound Toggle */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span
              id="version-pro-badge"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wider shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Versão 2.5 • Pro
            </span>

            {player.name ? (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span className="max-w-[90px] truncate">{player.name}</span>
                <button
                  type="button"
                  onClick={handleClearAccount}
                  title="Limpar / Sair"
                  className="text-slate-400 hover:text-red-600 transition-colors ml-0.5 text-xs font-black cursor-pointer leading-none"
                >
                  ×
                </button>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            id="sound-toggle-btn-welcome"
            onClick={onToggleSound}
            aria-label="Alternar som"
            title={soundEnabled ? 'Som Ativado' : 'Som Desativado'}
            className="w-8 h-8 rounded-xl bg-slate-100/90 hover:bg-slate-200/90 active:scale-95 text-slate-600 transition-all flex items-center justify-center border border-slate-200/60 shadow-xs cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>

        {/* Hero Branding & Floating App Icon */}
        <header className="text-center flex flex-col items-center pt-0.5 z-10" data-purpose="hero-header">
          <div className="relative mb-2 animate-levitate">
            <div className="absolute inset-0 bg-blue-500/25 rounded-2xl blur-md" />
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/25 border-2 border-white/90 relative bg-white flex items-center justify-center">
              <img
                src="/icon.png"
                alt="Ícone do Quebra-Cabeça Deslizante"
                className="w-full h-full object-cover select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-[9px] font-extrabold shadow border-2 border-white">
                <Star className="w-3 h-3 fill-amber-950 text-amber-950" />
              </div>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 drop-shadow-xs leading-tight">
            Quebra-Cabeça{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Deslizante
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 px-2 leading-tight">
            Desafie seu raciocínio lógico em cenários e paisagens surpreendentes!
          </p>
        </header>

        {/* Player Login / Customization Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 z-10" id="login-form">
          {/* Player Nickname Input */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="player-nickname"
              className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center justify-between"
            >
              <span>Apelido do Jogador</span>
              <span className="text-[9px] text-blue-600 font-semibold lowercase">obrigatório</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center justify-center text-blue-500 pointer-events-none">
                <User className="w-3.5 h-3.5" />
              </div>
              <input
                id="player-nickname"
                type="text"
                required
                maxLength={18}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Digite seu nome ou apelido..."
                className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-xs font-semibold rounded-xl pl-9 pr-3 py-2 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* Avatar Picker */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
              Escolha seu Avatar
            </span>
            <div className="grid grid-cols-5 gap-1.5" id="avatar-selector">
              {AVATAR_OPTIONS.map((emoji) => {
                const isSelected = emoji === selectedAvatar;
                return (
                  <button
                    key={emoji}
                    type="button"
                    id={`avatar-option-${emoji}`}
                    onClick={() => setSelectedAvatar(emoji)}
                    className={`avatar-option flex items-center justify-center p-1.5 rounded-xl text-lg transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-blue-50 border-2 border-blue-500 scale-105 shadow-xs'
                        : 'bg-slate-50 border-2 border-transparent hover:border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main CTA: Iniciar Jogo Button */}
          <button
            type="submit"
            id="btn-start-game"
            className="shimmer-btn w-full mt-0.5 py-2.5 px-4 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 border border-blue-300/30 cursor-pointer"
          >
            <span>Iniciar Jogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Options: Entrar Convidado & Google Connect */}
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-100 z-10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-guest-login"
              onClick={() => setIsLocalModalOpen(true)}
              className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100/90 hover:bg-emerald-50 active:bg-slate-200 text-slate-700 hover:text-emerald-700 font-bold text-[11px] transition-all border border-slate-200/70 hover:border-emerald-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <User className="w-3 h-3 text-slate-500" />
              <span>Entrar Convidado</span>
            </button>

            <button
              type="button"
              id="btn-google-login"
              onClick={() => setIsGoogleModalOpen(true)}
              className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100/90 hover:bg-blue-50 active:bg-slate-200 text-slate-700 hover:text-blue-700 font-bold text-[11px] transition-all border border-slate-200/70 hover:border-blue-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Google Connect</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Jogo Seguro
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-blue-500" /> Efeitos Sonoros
            </span>
          </div>
        </div>
      </section>

      {/* Google Login Dialog */}
      <GoogleLoginModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccessLogin={handleGoogleSuccess}
        soundEnabled={soundEnabled}
      />

      {/* Local Guest Account Dialog */}
      <LocalAccountModal
        isOpen={isLocalModalOpen}
        onClose={() => setIsLocalModalOpen(false)}
        onSaveAccount={handleLocalAccountSuccess}
      />
    </>
  );
};

