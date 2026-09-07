import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Footprints,
  Clock,
  Dices,
  Camera,
  RotateCw,
  Trophy,
  Play,
  Check,
  Sparkles,
} from 'lucide-react';
import { DifficultySize, ThemeItem, PlayerProfile } from '../types';
import {
  createSolvableShuffle,
  getEmptyIndex,
  getAdjacentIndices,
  checkVictory,
  getTileBackgroundPosition,
} from '../utils/puzzle';
import { playSlideSound, playInvalidSound, playVictoryFanfare } from '../utils/audio';

interface GameScreenProps {
  player: PlayerProfile;
  themes: ThemeItem[];
  currentThemeIndex: number;
  onSelectTheme: (index: number) => void;
  onOpenCustomPhotoModal: () => void;
  onBackToMenu: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  player,
  themes,
  currentThemeIndex,
  onSelectTheme,
  onOpenCustomPhotoModal,
  onBackToMenu,
  soundEnabled,
  onToggleSound,
}) => {
  const [gridSize, setGridSize] = useState<DifficultySize>(3);
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [invalidTileIndex, setInvalidTileIndex] = useState<number | null>(null);
  const [isRestarting, setIsRestarting] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const themeRowRef = useRef<HTMLDivElement | null>(null);

  const activeTheme = themes[currentThemeIndex] || themes[0];

  // Stop timer helper
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Initialize or restart puzzle
  const restartGame = useCallback(
    (size: DifficultySize = gridSize) => {
      stopTimer();
      setTimerSeconds(0);
      setMoves(0);
      setIsStarted(false);
      setIsVictory(false);
      setInvalidTileIndex(null);

      const shuffled = createSolvableShuffle(size);
      setTiles(shuffled);

      setIsRestarting(true);
      setTimeout(() => setIsRestarting(false), 400);
    },
    [gridSize, stopTimer]
  );

  // Initial setup and when gridSize changes
  useEffect(() => {
    restartGame(gridSize);
    return () => stopTimer();
  }, [gridSize, restartGame, stopTimer]);

  // When theme changes, restart board with new theme visuals
  useEffect(() => {
    restartGame(gridSize);
  }, [currentThemeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer runner
  useEffect(() => {
    if (isStarted && !isVictory) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isVictory]);

  const handleDifficultyChange = (size: DifficultySize) => {
    if (size === gridSize) return;
    setGridSize(size);
  };

  const handleTileClick = (clickedPos: number) => {
    if (isVictory) return;

    const emptyPos = getEmptyIndex(tiles, gridSize);
    const adjacent = getAdjacentIndices(emptyPos, gridSize);

    if (adjacent.includes(clickedPos)) {
      // Valid move
      if (!isStarted) {
        setIsStarted(true);
      }

      playSlideSound(soundEnabled);
      setMoves((m) => m + 1);

      // Swap tiles
      const nextTiles = [...tiles];
      nextTiles[emptyPos] = tiles[clickedPos];
      nextTiles[clickedPos] = tiles[emptyPos];
      setTiles(nextTiles);

      // Check Victory condition
      if (checkVictory(nextTiles)) {
        setIsVictory(true);
        stopTimer();
        playVictoryFanfare(soundEnabled);

        // Confetti celebration
        try {
          confetti({
            particleCount: 85,
            spread: 70,
            origin: { y: 0.6 },
          });
          setTimeout(() => {
            confetti({
              particleCount: 50,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
            });
            confetti({
              particleCount: 50,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
            });
          }, 250);
        } catch (e) {
          console.warn('Confetti error:', e);
        }
      }
    } else {
      // Invalid move feedback
      playInvalidSound(soundEnabled);
      setInvalidTileIndex(clickedPos);
      setTimeout(() => {
        setInvalidTileIndex(null);
      }, 350);
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = String(Math.floor(totalSecs / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const emptyTileValue = gridSize * gridSize - 1;

  return (
    <main
      id="game-screen"
      data-purpose="puzzle-app-container"
      className="w-full max-w-[400px] bg-white/95 backdrop-blur-xl rounded-3xl p-3.5 sm:p-4.5 shadow-2xl border border-white/80 flex flex-col gap-2.5 sm:gap-3.5 relative z-10 overflow-hidden my-auto"
    >
      {/* Top Header & Navigation Bar */}
      <header className="text-center pt-0.5 relative flex flex-col" data-purpose="game-header">
        <div className="flex items-center justify-between mb-1.5">
          {/* Back to Home / Login Button */}
          <button
            type="button"
            id="btn-back-menu"
            onClick={onBackToMenu}
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/90 active:scale-95 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 border border-slate-200/70 shadow-xs cursor-pointer"
            title="Voltar ao Início"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Início</span>
          </button>

          {/* Personalized Player Badge */}
          <div
            id="player-banner"
            className="flex items-center gap-1.5 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-xl shadow-xs"
          >
            {player.accountType === 'google' ? (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-black">
                G
              </span>
            ) : (
              <span id="player-avatar-badge" className="text-sm">
                {player.avatar || '🚀'}
              </span>
            )}
            <span
              id="player-name-badge"
              className="text-xs font-extrabold text-blue-700 max-w-[110px] truncate"
            >
              {player.name || 'Jogador'}
            </span>
          </div>

          {/* Audio Mute / Unmute Button */}
          <button
            type="button"
            id="sound-toggle-btn"
            onClick={onToggleSound}
            aria-label="Alternar som"
            title={soundEnabled ? 'Som Ativado' : 'Som Desativado'}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-600 transition-all flex items-center justify-center border border-slate-200/60 shadow-xs cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>

        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 drop-shadow-xs flex items-center justify-center gap-2">
          <img
            src="/icon.png"
            alt="Ícone do Aplicativo"
            className="w-6 h-6 rounded-lg shadow-xs border border-white/80 select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <span>Quebra-Cabeça Deslizante</span>
        </h1>
        <p
          id="theme-subtitle"
          className="text-xs text-slate-400 font-bold mt-0.5 tracking-wider uppercase truncate px-2"
        >
          {activeTheme.title}
        </p>
      </header>

      {/* Game Stats Metrics */}
      <section
        id="game-metrics"
        data-purpose="game-metrics"
        className="bg-slate-50/90 rounded-2xl p-2.5 px-4 border border-slate-200/70 flex items-center justify-between shadow-xs"
      >
        {/* Moves Counter */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center text-sm font-semibold shadow-xs">
            <Footprints className="w-4 h-4 -rotate-90" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block leading-none">Movimentos</span>
            <span id="moves-display" className="text-base font-extrabold text-slate-800 tracking-tight">
              {moves}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-7 w-[1px] bg-slate-200" />

        {/* Time Metric */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center text-sm shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block leading-none">Tempo</span>
            <span
              id="timer-display"
              className="text-base font-extrabold text-slate-800 tracking-tight font-mono"
            >
              {formatTimer(timerSeconds)}
            </span>
          </div>
        </div>
      </section>

      {/* Difficulty Selector */}
      <nav
        id="difficulty-toggle"
        aria-label="Seletor de Dificuldade"
        className="bg-slate-100/80 p-1 rounded-2xl flex items-center justify-between gap-1 border border-slate-200/50"
      >
        <button
          type="button"
          id="diff-3"
          onClick={() => handleDifficultyChange(3)}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
            gridSize === 3
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          Fácil (3×3)
        </button>
        <button
          type="button"
          id="diff-4"
          onClick={() => handleDifficultyChange(4)}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
            gridSize === 4
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          Médio (4×4)
        </button>
        <button
          type="button"
          id="diff-5"
          onClick={() => handleDifficultyChange(5)}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
            gridSize === 5
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          Difícil (5×5)
        </button>
      </nav>

      {/* Puzzle Board & Victory Modal Container */}
      <div className="relative w-full aspect-square">
        <section
          id="puzzle-board"
          data-purpose="sliding-puzzle-board"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
          className="w-full h-full bg-slate-100/90 p-1 sm:p-1.5 rounded-[24px] border border-slate-200/70 shadow-inner grid gap-1 sm:gap-1.5"
        >
          {tiles.map((val, pos) => {
            if (val === emptyTileValue) {
              return (
                <div
                  key="empty-slot"
                  id="empty-board-slot"
                  data-purpose="empty-board-slot"
                  className="w-full h-full rounded-md sm:rounded-lg bg-slate-200/40 border border-dashed border-slate-300/80 shadow-inner flex items-center justify-center transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-300/70 animate-pulse" />
                </div>
              );
            }

            const { xPercent, yPercent } = getTileBackgroundPosition(val, gridSize);
            const isShaking = invalidTileIndex === pos;

            return (
              <button
                key={`tile-${val}`}
                type="button"
                id={`puzzle-tile-${val + 1}`}
                aria-label={`Peça ${val + 1}`}
                onClick={() => handleTileClick(pos)}
                style={{
                  backgroundImage: `url("${activeTheme.url}")`,
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  backgroundPosition: `${xPercent}% ${yPercent}%`,
                }}
                className={`puzzle-tile w-full h-full rounded-md sm:rounded-lg shadow-sm hover:shadow-md border border-white/40 relative overflow-hidden group focus:outline-none cursor-pointer ${
                  isShaking ? 'tile-invalid' : ''
                }`}
              >
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
              </button>
            );
          })}
        </section>

        {/* Victory Celebration Modal Overlay */}
        {isVictory && (
          <div
            id="victory-modal"
            className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-[28px] flex flex-col items-center justify-center p-6 text-center shadow-2xl transition-all duration-300 z-20 animate-in fade-in zoom-in-95"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-2.5 shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-0.5">
              Parabéns, {player.name}!
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Você completou o quebra-cabeça com maestria!
            </p>

            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 w-full max-w-[240px] flex justify-around mb-5 text-center shadow-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Movimentos</span>
                <span id="victory-moves" className="text-base font-extrabold text-slate-800">
                  {moves}
                </span>
              </div>
              <div className="w-[1px] bg-slate-200" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tempo</span>
                <span id="victory-time" className="text-base font-extrabold text-slate-800 font-mono">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-play-again"
                onClick={() => restartGame(gridSize)}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Jogar Novamente</span>
              </button>

              <button
                type="button"
                id="btn-victory-menu"
                onClick={onBackToMenu}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-2xl border border-slate-200/80 active:scale-95 transition-all cursor-pointer"
              >
                <span>Menu</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Themes Gallery Section */}
      <section className="flex flex-col gap-1.5" data-purpose="theme-selection">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Temas Disponíveis
          </span>
          <button
            type="button"
            id="btn-shuffle-theme"
            onClick={() => {
              playSlideSound(soundEnabled);
              restartGame(gridSize);
            }}
            className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Embaralhar</span>
          </button>
        </div>

        {/* Carousel with snap */}
        <div
          ref={themeRowRef}
          id="theme-row"
          className="flex items-center gap-2.5 px-1 py-1 overflow-x-auto no-scrollbar scroll-smooth snap-x"
        >
          {themes.map((t, idx) => {
            const isSelected = idx === currentThemeIndex;
            return (
              <button
                key={t.id + idx}
                type="button"
                id={`theme-select-${t.id}`}
                aria-label={`Tema: ${t.name}`}
                title={t.name}
                onClick={() => onSelectTheme(idx)}
                className={`w-12 h-12 flex-shrink-0 snap-center rounded-xl overflow-hidden transition-all duration-200 relative shadow-xs cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 opacity-100'
                    : 'opacity-70 hover:opacity-100 hover:scale-105 border border-slate-200'
                }`}
              >
                <img
                  src={t.thumb}
                  alt={t.name}
                  className="w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                {isSelected && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-tl-md px-1 py-0.5 text-[8px] flex items-center justify-center shadow-xs">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Action Buttons: Custom Photo/Link & Restart Game */}
      <footer className="grid grid-cols-2 gap-3 pt-1" data-purpose="game-action-buttons">
        {/* Custom Photo / Direct Link Button */}
        <button
          type="button"
          id="btn-use-custom-photo"
          onClick={onOpenCustomPhotoModal}
          className="flex items-center justify-center gap-2 py-3.5 px-3 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-colors border border-slate-200/60 shadow-xs cursor-pointer"
        >
          <Camera className="w-4 h-4 text-slate-500" />
          <span>Usar Minha Foto</span>
        </button>

        {/* Restart Game Button */}
        <button
          type="button"
          id="btn-restart-game"
          onClick={() => {
            playSlideSound(soundEnabled);
            restartGame(gridSize);
          }}
          className="flex items-center justify-center gap-2 py-3.5 px-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-500/30 transition-all border border-blue-400/30 cursor-pointer"
        >
          <RotateCw
            className={`w-4 h-4 transition-transform duration-300 ${
              isRestarting ? 'rotate-180' : ''
            }`}
          />
          <span>Reiniciar Jogo</span>
        </button>
      </footer>
    </main>
  );
};
