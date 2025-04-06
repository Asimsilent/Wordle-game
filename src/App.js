import { useEffect, useRef, useState } from "react";
import Line from "./components/Line";

function App() {
  const [gameState, setGameState] = useState({
    word: "",
    tries: Array(6).fill(null),
    curTry: "",
    isGameOver: false,
    isCorrect: null,
    curTryIndex: 0,
    validWords: [],
  });

  const [isMobile] = useState(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
  const [keyboardVisible, setKeyboardVisible] = useState(true);
  const appRef = useRef(null);

  // Auto-hide keyboard when game ends
  useEffect(() => {
    if (gameState.isGameOver) {
      setKeyboardVisible(false);
    }
  }, [gameState.isGameOver]);

  // Handle keyboard toggle
  const toggleKeyboard = () => {
    setKeyboardVisible(!keyboardVisible);
  };

  // Mobile keyboard handler
  const handleMobileKeyPress = (key) => {
    if (gameState.isGameOver) return;

    if (key === "Enter") {
      if (gameState.curTry.length === 5) {
        setGameState((prev) => {
          const newTry = [...prev.tries];
          newTry[prev.tries.findIndex((val) => val == null)] = prev.curTry;
          const isCorrect = prev.curTry === prev.word;
          return {
            ...prev,
            tries: newTry,
            curTry: "",
            curTryIndex: 0,
            isGameOver: isCorrect,
            isCorrect: isCorrect,
          };
        });
      }
      return;
    }

    if (key === "Backspace") {
      setGameState((prev) => ({
        ...prev,
        curTry: prev.curTry.slice(0, -1),
        curTryIndex: Math.max(prev.curTryIndex - 1, 0),
      }));
      return;
    }

    if (/^[a-z]$/.test(key) && gameState.curTry.length < 5) {
      setGameState((prev) => ({
        ...prev,
        curTry: prev.curTry + key,
        curTryIndex: prev.curTryIndex + 1,
      }));
    }
  };

  // Mobile keyboard component
  const MobileKeyboard = () => (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#f0f0f0',
      padding: '10px',
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 1fr)',
      gap: '5px',
      zIndex: 10,
      transform: keyboardVisible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.3s ease'
    }}>
      {['q','w','e','r','t','y','u','i','o','p'].map(char => (
        <button 
          key={char}
          onClick={() => handleMobileKeyPress(char)}
          style={keyButtonStyle}
        >
          {char}
        </button>
      ))}
      <div style={{gridColumn: 'span 10'}}></div>
      {['a','s','d','f','g','h','j','k','l'].map(char => (
        <button 
          key={char}
          onClick={() => handleMobileKeyPress(char)}
          style={keyButtonStyle}
        >
          {char}
        </button>
      ))}
      <div style={{gridColumn: 'span 10'}}></div>
      <button 
        onClick={() => handleMobileKeyPress('z')}
        style={keyButtonStyle}
      >
        z
      </button>
      <button 
        onClick={() => handleMobileKeyPress('x')}
        style={keyButtonStyle}
      >
        x
      </button>
      <button 
        onClick={() => handleMobileKeyPress('c')}
        style={keyButtonStyle}
      >
        c
      </button>
      <button 
        onClick={() => handleMobileKeyPress('v')}
        style={keyButtonStyle}
      >
        v
      </button>
      <button 
        onClick={() => handleMobileKeyPress('b')}
        style={keyButtonStyle}
      >
        b
      </button>
      <button 
        onClick={() => handleMobileKeyPress('n')}
        style={keyButtonStyle}
      >
        n
      </button>
      <button 
        onClick={() => handleMobileKeyPress('m')}
        style={keyButtonStyle}
      >
        m
      </button>
      <button 
        onClick={() => handleMobileKeyPress('Backspace')}
        style={{
          ...keyButtonStyle,
          backgroundColor: '#ff4444',
          color: 'white',
          gridColumn: 'span 3'
        }}
      >
        ⌫
      </button>
      <button 
        onClick={() => toggleKeyboard()}
        style={{
          ...keyButtonStyle,
          backgroundColor: '#666',
          color: 'white'
        }}
      >
        {keyboardVisible ? '⌄' : '⌃'}
      </button>
      <button 
        onClick={() => handleMobileKeyPress('Enter')}
        style={{
          ...keyButtonStyle,
          backgroundColor: '#4CAF50',
          color: 'white',
          gridColumn: 'span 3'
        }}
      >
        Enter
      </button>
    </div>
  );

  // Style for keyboard buttons
  const keyButtonStyle = {
    padding: '10px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#fff'
  };

  // Desktop keyboard handler
  useEffect(() => {
    if (isMobile) return;

    function handleTry(e) {
      if (gameState.isGameOver) return;

      if (e.key === "Enter") {
        if (gameState.curTry.length !== 5) {
          console.log("Enter a 5-letter word");
          return;
        }

        setGameState((prevTries) => {
          const newTry = [...prevTries.tries];
          newTry[prevTries.tries.findIndex((val) => val == null)] =
            gameState.curTry;
          const isCorrect = gameState.curTry === gameState.word;
          return { 
            ...prevTries, 
            tries: newTry, 
            curTry: "", 
            curTryIndex: 0,
            isGameOver: isCorrect,
            isCorrect: isCorrect
          };
        });
        return;
      }

      if (e.key === "Backspace") {
        setGameState((perState) => ({
          ...perState,
          curTry: gameState.curTry.slice(0, -1),
          curTryIndex: Math.max(perState.curTryIndex - 1, 0),
        }));
        return;
      }

      if (/^[a-z]$/i.test(e.key) && gameState.curTry.length < 5) {
        setGameState((perState) => ({
          ...perState,
          curTry: perState.curTry + e.key.toLowerCase(),
          curTryIndex: perState.curTryIndex + 1,
        }));
      }
    }

    window.addEventListener("keydown", handleTry);
    return () => window.removeEventListener("keydown", handleTry);
  }, [gameState, isMobile]);

  // Game over check
  useEffect(() => {
    if (
      gameState.tries.findIndex((val) => val == null) === -1 &&
      !gameState.isCorrect &&
      !gameState.isGameOver
    ) {
      setGameState(prev => ({
        ...prev,
        isGameOver: true,
        isCorrect: false
      }));
    }
  }, [gameState]);

  // Fetch word
  useEffect(() => {
    async function fetchWord() {
      try {
        const res = await fetch(
          "https://api.datamuse.com/words?sp=?????&max=1000"
        );
        const data = await res.json();
        const validWords = data.map(value => value.word);
        const randomWord = data[Math.floor(Math.random() * data.length)].word;
        setGameState(prev => ({
          ...prev,
          word: randomWord || "",
          validWords: validWords,
        }));
      } catch (error) {
        console.error("Error fetching word list", error);
      }
    }
    fetchWord();
  }, []);

  function resetGame() {
    setGameState({
      word: "",
      tries: Array(6).fill(null),
      curTry: "",
      isGameOver: false,
      isCorrect: null,
      curTryIndex: 0,
      validWords: [],
    });
    if (isMobile) {
      setKeyboardVisible(true);
    }
  }

  return (
    <div 
      className="app" 
      ref={appRef}
      style={{ 
        paddingBottom: isMobile ? (keyboardVisible ? '250px' : '20px') : '20px',
        transition: 'padding-bottom 0.3s ease'
      }}
    >
      <h1>لعبة ووردل</h1>
      <h2>إهداء إلى إلين</h2>

      {gameState.tries.map((attempt, i) => {
        const isCurrentGuess =
          i === gameState.tries.findIndex((val) => val == null);
        return (
          <Line
            key={i}
            attempt={isCurrentGuess ? gameState.curTry : attempt ?? ""}
            isFinal={!isCurrentGuess && attempt != null}
            word={gameState.word}
            curTryIndex={isCurrentGuess && gameState.curTryIndex}
          />
        );
      })}

      <button onClick={resetGame} className="button">
        إعادة اللعبة
      </button>

      <div className="instructions">
        <p className="instruction">
          <span style={{ backgroundColor: "lightgreen" }}></span>
          <span>الحرف الصحيح في المكان الصحيح</span>
        </p>
        <p className="instruction">
          <span style={{ backgroundColor: "yellow" }}></span>
          <span>الحرف الصحيح في المكان الخطأ</span>
        </p>
        <p className="instruction">
          <span style={{ backgroundColor: "rgba(164, 40, 40, 0.332)" }}></span>
          <span>حرف غير صحيح</span>
        </p>
      </div>

      <div className="note">سواء فزت أو خسرت، سأظل أحبك</div>

      {/* Game messages positioned above keyboard */}
      <div style={{
        position: isMobile ? 'fixed' : 'static',
        bottom: isMobile ? (keyboardVisible ? '250px' : '20px') : 'auto',
        left: 0,
        right: 0,
        zIndex: 5,
        padding: '10px',
        backgroundColor: isMobile ? 'rgba(0,0,0,0.7)' : 'transparent',
        color: isMobile ? 'white' : 'inherit',
        textAlign: 'center',
        transition: 'bottom 0.3s ease'
      }}>
        {gameState.isCorrect === true && (
          <p className="win-message">
            لقد فزت باللعبة في{" "}
            <span>
              {gameState.tries.findIndex((val) => val == null) === -1
                ? 6
                : gameState.tries.findIndex((val) => val == null)}
            </span>{" "}
            محاولة
          </p>
        )}
        {gameState.isCorrect === false && (
          <>
            <p className="loss-message">لقد خسرت اللعبة، انتهت محاولاتك</p>
            <p className="loss-message">
              الكلمة الصحيحة هي <span>{gameState.word.toUpperCase()}</span>
            </p>
          </>
        )}
      </div>

      {/* Mobile keyboard */}
      {isMobile && <MobileKeyboard />}
    </div>
  );
}

export default App;