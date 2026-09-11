import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GameScreen } from './components/GameScreen';
import { CustomPhotoModal } from './components/CustomPhotoModal';
import { INITIAL_THEMES } from './data/themes';
import { PlayerProfile, ScreenType, ThemeItem } from './types';
import { getAudioContext, playSlideSound } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [player, setPlayer] = useState<PlayerProfile>({
    name: '',
    avatar: '🚀',
  });
  const [themes, setThemes] = useState<ThemeItem[]>(INITIAL_THEMES);
  const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);

  const handleToggleSound = () => {
    getAudioContext();
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    if (nextVal) {
      playSlideSound(true);
    }
  };

  const handleStartGame = () => {
    getAudioContext();
    playSlideSound(soundEnabled);
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    getAudioContext();
    playSlideSound(soundEnabled);
    setCurrentScreen('welcome');
  };

  const handleSelectTheme = (index: number) => {
    getAudioContext();
    playSlideSound(soundEnabled);
    setCurrentThemeIndex(index);
  };

  const handleNextPhase = () => {
    getAudioContext();
    playSlideSound(soundEnabled);
    setCurrentThemeIndex((currentIndex) => (currentIndex + 1) % themes.length);
  };

  const handleApplyCustomImage = (imageUrl: string, themeName: string) => {
    getAudioContext();
    const newCustomTheme: ThemeItem = {
      id: 'custom-' + Date.now(),
      name: themeName,
      title: `Edição ${themeName}`,
      url: imageUrl,
      thumb: imageUrl,
      isCustom: true,
    };

    // Prepend new custom theme
    setThemes((prev) => [newCustomTheme, ...prev]);
    setCurrentThemeIndex(0);
    playSlideSound(soundEnabled);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
      {/* Ambient background glowing orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Floating particles */}
      <div
        className="particle-dot w-1.5 h-1.5"
        style={{ left: '15%', animationDuration: '12s', animationDelay: '1s' }}
      />
      <div
        className="particle-dot w-2 h-2"
        style={{ left: '45%', animationDuration: '9s', animationDelay: '3s' }}
      />
      <div
        className="particle-dot w-1.5 h-1.5"
        style={{ left: '75%', animationDuration: '14s', animationDelay: '0.5s' }}
      />
      <div
        className="particle-dot w-2.5 h-2.5"
        style={{ left: '88%', animationDuration: '11s', animationDelay: '5s' }}
      />
      <div
        className="particle-dot w-1 h-1"
        style={{ left: '28%', animationDuration: '16s', animationDelay: '2s' }}
      />

      {/* Active Screen View */}
      {currentScreen === 'welcome' ? (
        <WelcomeScreen
          player={player}
          onUpdatePlayer={setPlayer}
          onStartGame={handleStartGame}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      ) : (
        <GameScreen
          player={player}
          themes={themes}
          currentThemeIndex={currentThemeIndex}
          onSelectTheme={handleSelectTheme}
          onNextPhase={handleNextPhase}
          onOpenCustomPhotoModal={() => setIsPhotoModalOpen(true)}
          onBackToMenu={handleBackToMenu}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* Modal for Custom Photo or Direct Image Links */}
      <CustomPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onApplyImage={handleApplyCustomImage}
      />
    </div>
  );
}
