import { useEffect, useMemo, useState } from "react";
import { INITIAL_THEMES } from "./data/themes";
import { playInvalidSound, playSlideSound, playVictoryFanfare } from "./utils/audio";

type Difficulty = 3 | 4 | 5;
type ScreenState = "welcome" | "game";

function createSolved(size: Difficulty) {
  return Array.from({ length: size * size }, (_, i) => i);
}

function neighbors(index: number, size: number) {
  const row = Math.floor(index / size);
  const col = index % size;
  const result: number[] = [];

  if (row > 0) result.push(index - size);
  if (row < size - 1) result.push(index + size);
  if (col > 0) result.push(index - 1);
  if (col < size - 1) result.push(index + 1);

  return result;
}

function shufflePuzzle(size: Difficulty, steps = 180) {
  const board = createSolved(size);
  let empty = board.length - 1;
  let previous = -1;

  for (let i = 0; i < steps; i += 1) {
    const choices = neighbors(empty, size).filter((n) => n !== previous);
    const next = choices[Math.floor(Math.random() * choices.length)];
    [board[empty], board[next]] = [board[next], board[empty]];
    previous = empty;
    empty = next;
  }

  return board;
}

function formatTime(total: number) {
  const min = Math.floor(total / 60).toString().padStart(2, "0");
  const sec = (total % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

export default function App() {
  const [screen, setScreen] = useState<ScreenState>("welcome");
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [nickname, setNickname] = useState("Jogador");
  const [avatar, setAvatar] = useState("🚀");
  const [themeIndex, setThemeIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>(3);
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState<number[]>(() => shufflePuzzle(3));
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [coins, setCoins] = useState(120);
  const [lives, setLives] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsSplashVisible(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  const activeTheme = INITIAL_THEMES[themeIndex] || INITIAL_THEMES[0];
  const solved = useMemo(() => createSolved(difficulty), [difficulty]);
  const progress = Math.round(
    (board.filter((value, i) => value === solved[i]).length / board.length) * 100
  );

  const startRound = (nextDifficulty: Difficulty = difficulty, nextLevel = level) => {
    setDifficulty(nextDifficulty);
    setLevel(nextLevel);
    setBoard(shufflePuzzle(nextDifficulty));
    setMoves(0);
    setSeconds(0);
    setWon(false);
    setGameOver(false);
    setPlaying(true);
  };

  useEffect(() => {
    if (!playing || won || gameOver) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [playing, won, gameOver]);

  const handleStartGame = () => {
    const playerName = nickname.trim() || "Jogador";
    setScreen("game");
    startRound(difficulty, level);
    setNickname(playerName);
  };

  const handleNextLevel = () => {
    const nextLevel = level + 1;
    const nextDifficulty: Difficulty = nextLevel % 3 === 0 ? 5 : nextLevel % 2 === 0 ? 4 : 3;
    setLevel(nextLevel);
    startRound(nextDifficulty, nextLevel);
  };

  const handleTileClick = (index: number) => {
    if (!playing || won || gameOver) return;

    const emptyIndex = board.indexOf(board.length - 1);
    if (!neighbors(emptyIndex, difficulty).includes(index)) {
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
      playInvalidSound(soundEnabled);

      if (nextLives === 0) {
        setGameOver(true);
        setPlaying(false);
      }
      return;
    }

    const nextBoard = [...board];
    [nextBoard[emptyIndex], nextBoard[index]] = [nextBoard[index], nextBoard[emptyIndex]];

    setBoard(nextBoard);
    setMoves((value) => value + 1);
    playSlideSound(soundEnabled);

    if (nextBoard.every((value, i) => value === solved[i])) {
      const reward = 25 + level * 12 + difficulty * 10;
      setCoins((value) => value + reward);
      setWon(true);
      setPlaying(false);
      playVictoryFanfare(soundEnabled);
    }
  };

  const resetGame = () => {
    setScreen("welcome");
    setNickname("Jogador");
    setAvatar("🚀");
    setLives(3);
    setCoins(120);
    setLevel(1);
    setDifficulty(3);
    setBoard(shufflePuzzle(3));
    setMoves(0);
    setSeconds(0);
    setWon(false);
    setGameOver(false);
    setPlaying(false);
  };

  return (
    <main className="app-shell">
      {isSplashVisible && (
        <div className="splash-screen" aria-live="polite">
          <div className="splash-icon">🧩</div>
          <div className="splash-text">Quebra-Cabeça</div>
          <div className="splash-subtext">Deslizante</div>
        </div>
      )}

      <div className="phone-topbar" aria-hidden="true">
        <span className="camera" />
        <span className="speaker" />
      </div>

      {screen === "welcome" ? (
        <section className="welcome-card">
          <div className="welcome-topbar">
            <span className="badge">Versão Pro</span>
            <button
              type="button"
              className="sound-toggle"
              onClick={() => setSoundEnabled((value) => !value)}
              aria-label="Alternar som"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>

          <div className="brand-block">
            <div className="brand-mark">🧩</div>
            <h1>
              Quebra-Cabeça <span>Deslizante</span>
            </h1>
            <p>Desafie seu raciocínio com paisagens, níveis e imagens incríveis.</p>
          </div>

          <div className="theme-preview-card">
            <img src={activeTheme.thumb} alt={activeTheme.name} />
            <div>
              <small>Imagem selecionada</small>
              <strong>{activeTheme.name}</strong>
            </div>
          </div>

          <div className="player-box">
            <label htmlFor="nickname">Nome do jogador</label>
            <input
              id="nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              maxLength={18}
              placeholder="Digite seu nome..."
            />

            <div className="avatar-picker">
              {['🚀', '🦁', '⚡', '🏝️', '👾', '🦊', '🐼', '🌟'].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={avatar === option ? "avatar active" : "avatar"}
                  onClick={() => setAvatar(option)}
                  aria-label={`Avatar ${option}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="theme-picker">
            <div className="section-label-row">
              <span>Selecione uma imagem</span>
            </div>
            <div className="theme-grid">
              {INITIAL_THEMES.map((theme, index) => (
                <button
                  key={theme.id}
                  type="button"
                  className={themeIndex === index ? "theme-tile active" : "theme-tile"}
                  onClick={() => setThemeIndex(index)}
                  title={theme.name}
                >
                  <img src={theme.thumb} alt={theme.name} />
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="start-button" onClick={handleStartGame}>
            Iniciar jogo
          </button>
        </section>
      ) : (
        <section className="game-card">
          <header className="game-topbar">
            <button type="button" className="ghost-button" onClick={resetGame}>
              ← Menu
            </button>
            <div className="status-row">
              <div className="stat-pill coin">🪙 {coins}</div>
              <div className="stat-pill life">❤️ {lives}</div>
              <button
                type="button"
                className="stat-pill sound"
                onClick={() => setSoundEnabled((value) => !value)}
                aria-label="Alternar som"
              >
                {soundEnabled ? "🔊" : "🔇"}
              </button>
            </div>
          </header>

          <div className="headline-row">
            <div>
              <small>Jogador</small>
              <strong>{nickname || "Jogador"}</strong>
            </div>
            <div className="level-badge">Nível {level}</div>
          </div>

          <div className="active-theme-banner">
            <img src={activeTheme.thumb} alt={activeTheme.name} />
            <div>
              <small>Imagem atual</small>
              <strong>{activeTheme.name}</strong>
            </div>
          </div>

          <div className="metrics">
            <div className="metric-box">
              <span>Tempo</span>
              <b>{formatTime(seconds)}</b>
            </div>
            <div className="metric-box">
              <span>Movimentos</span>
              <b>{moves}</b>
            </div>
            <div className="metric-box">
              <span>Tamanho</span>
              <b>{difficulty}×{difficulty}</b>
            </div>
          </div>

          <div className="progress-area">
            <div className="progress-label-row">
              <span>Progresso</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${Math.max(progress, 8)}%` }} />
            </div>
          </div>

          <div className="difficulty-row">
            {[3, 4, 5].map((size) => (
              <button
                key={size}
                type="button"
                className={difficulty === size ? "difficulty active" : "difficulty"}
                onClick={() => startRound(size as Difficulty, level)}
              >
                {size}×{size}
              </button>
            ))}
          </div>

          <div className="board-panel">
            <div
              className="puzzle-board"
              style={{ gridTemplateColumns: `repeat(${difficulty}, minmax(0, 1fr))` }}
            >
              {board.map((tile, index) => {
                const isEmpty = tile === board.length - 1;
                const row = Math.floor(tile / difficulty);
                const col = tile % difficulty;

                return (
                  <button
                    key={`${tile}-${index}`}
                    type="button"
                    className={isEmpty ? "tile empty" : "tile"}
                    onClick={() => handleTileClick(index)}
                    style={
                      isEmpty
                        ? undefined
                        : {
                            backgroundImage: `url("${activeTheme.url}")`,
                            backgroundSize: `${difficulty * 100}% ${difficulty * 100}%`,
                            backgroundPosition: `${(col / (difficulty - 1)) * 100}% ${(row / (difficulty - 1)) * 100}%`,
                          }
                    }
                    aria-label={isEmpty ? "Espaço vazio" : `Peça ${tile + 1}`}
                  />
                );
              })}
            </div>

            {won && (
              <div className="win-overlay">
                <div className="win-badge">WIN!</div>
                <h2>Parabéns, {nickname || "Jogador"}!</h2>
                <p>
                  Você concluiu o nível em <strong>{formatTime(seconds)}</strong> e ganhou <strong>{25 + level * 12 + difficulty * 10}</strong> moedas.
                </p>
                <div className="win-actions">
                  <button type="button" onClick={handleNextLevel}>
                    Próximo nível
                  </button>
                  <button type="button" className="secondary" onClick={() => startRound(difficulty, level)}>
                    Jogar de novo
                  </button>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="win-overlay loss">
                <div className="win-badge danger">FIM</div>
                <h2>Você perdeu!</h2>
                <p>As vidas acabaram. Tente novamente e siga para o próximo desafio.</p>
                <div className="win-actions">
                  <button type="button" onClick={() => startRound(difficulty, level)}>
                    Recomeçar
                  </button>
                  <button type="button" className="secondary" onClick={resetGame}>
                    Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
