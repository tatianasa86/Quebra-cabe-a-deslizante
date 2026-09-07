import React, { useState } from 'react';
import { Volume2, VolumeX, Puzzle, Star, ArrowRight, User, ShieldCheck, Layers, Sparkles } from 'lucide-react';
import { PlayerProfile } from '../types';

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
  const [nickname, setNickname] = useState(player.name || 'Gamer');
  const [selectedAvatar, setSelectedAvatar] = useState(player.avatar || '🚀');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nickname.trim() || 'Jogador';
    onUpdatePlayer({ name: finalName, avatar: selectedAvatar });
    onStartGame();
  };

  const handleQuickGuest = () => {
    const guestAvatars = ['🦊', '🐱', '🐼', '🐯', '🌟'];
    const randomAvatar = guestAvatars[Math.floor(Math.random() * guestAvatars.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    const guestName = `Convidado #${randomNum}`;
    onUpdatePlayer({ name: guestName, avatar: randomAvatar });
    onStartGame();
  };

  const handleQuickGoogle = () => {
    onUpdatePlayer({ name: 'Google Player', avatar: '⭐' });
    onStartGame();
  };

  return (
    <section
      id="welcome-screen"
      data-purpose="welcome-login-screen"
      className="w-full max-w-[420px] bg-white/95 backdrop-blur-xl rounded-[36px] p-6 sm:p-7 shadow-2xl border border-white/80 flex flex-col gap-5 relative z-10 overflow-hidden transition-all"
    >
      {/* Decorative top background blur */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-blue-100/60 blur-xl pointer-events-none" />

      {/* Top Bar: Pro Badge & Sound Toggle */}
      <div className="flex items-center justify-between z-10">
        <span
          id="version-pro-badge"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-bold uppercase tracking-wider shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Versão 2.5 • Pro
        </span>

        <button
          type="button"
          id="sound-toggle-btn-welcome"
          onClick={onToggleSound}
          aria-label="Alternar som"
          title={soundEnabled ? 'Som Ativado' : 'Som Desativado'}
          className="w-9 h-9 rounded-2xl bg-slate-100/90 hover:bg-slate-200/90 active:scale-95 text-slate-600 transition-all flex items-center justify-center border border-slate-200/60 shadow-xs cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-blue-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>

      {/* Hero Branding & Floating App Icon */}
      <header className="text-center flex flex-col items-center pt-1 z-10" data-purpose="hero-header">
        <div className="relative mb-3 animate-levitate">
          <div className="absolute inset-0 bg-blue-500/25 rounded-3xl blur-md" />
          <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-xl shadow-blue-500/25 border-2 border-white/90 relative bg-white flex items-center justify-center">
            <img
              src="/icon.png"
              alt="Ícone do Quebra-Cabeça Deslizante"
              className="w-full h-full object-cover select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-[10px] font-extrabold shadow border-2 border-white">
              <Star className="w-3.5 h-3.5 fill-amber-950 text-amber-950" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900 drop-shadow-xs leading-tight">
          Quebra-Cabeça<br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Deslizante
          </span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1.5 px-3 leading-relaxed">
          Desafie seu raciocínio lógico em cenários paradisíacos e paisagens surpreendentes!
        </p>
      </header>

      {/* Player Login / Customization Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 z-10" id="login-form">
        {/* Player Nickname Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="player-nickname"
            className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center justify-between"
          >
            <span>Apelido do Jogador</span>
            <span className="text-[10px] text-blue-600 font-semibold lowercase">obrigatório</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center justify-center text-blue-500 pointer-events-none">
              <User className="w-4 h-4" />
            </div>
            <input
              id="player-nickname"
              type="text"
              required
              maxLength={18}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Digite seu nome ou apelido..."
              className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-sm font-semibold rounded-2xl pl-10 pr-4 py-3.5 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            />
          </div>
        </div>

        {/* Avatar Picker */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            Escolha seu Avatar
          </span>
          <div className="grid grid-cols-5 gap-2" id="avatar-selector">
            {AVATAR_OPTIONS.map((emoji) => {
              const isSelected = emoji === selectedAvatar;
              return (
                <button
                  key={emoji}
                  type="button"
                  id={`avatar-option-${emoji}`}
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`avatar-option flex items-center justify-center p-2.5 rounded-2xl text-xl transition-all cursor-pointer active:scale-95 ${
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
          className="shimmer-btn w-full mt-1 py-4 px-6 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-blue-300/30 cursor-pointer"
        >
          <span>Iniciar Jogo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Options / Guest Mode */}
      <div className="flex flex-col gap-3 pt-1 border-t border-slate-100 z-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-guest-login"
            onClick={handleQuickGuest}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-100/90 hover:bg-slate-200/80 active:bg-slate-200 text-slate-700 font-bold text-xs transition-all border border-slate-200/70 flex items-center justify-center gap-2 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Entrar Convidado</span>
          </button>

          <button
            type="button"
            id="btn-google-login"
            onClick={handleQuickGoogle}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-100/90 hover:bg-slate-200/80 active:bg-slate-200 text-slate-700 font-bold text-xs transition-all border border-slate-200/70 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>Google Connect</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Jogo Seguro
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-blue-500" /> Efeitos Sonoros
          </span>
        </div>
      </div>
    </section>
  );
};
