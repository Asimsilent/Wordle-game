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
  const inputRef = useRef(null);
  const lastValue = useRef("");

  // Mobile input setup
  useEffect(() => {
    if (isMobile && inputRef.current) {
      const focusInput = () => {
        inputRef.current?.focus();
        // Ensure soft keyboard stays open
        setTimeout(() => inputRef.current?.focus(), 100);
      };

      // Focus on mount
      setTimeout(focusInput, 500);

      // Focus on any tap
      document.addEventListener("click", focusInput);

      return () => document.removeEventListener("click", focusInput);
    }
  }, [isMobile]);

  useEffect(() => {
    function handleTry(e) {
      if (gameState.isGameOver || isMobile) {
        return;
      }

      if (e.key === "Enter") {
        if (gameState.curTry.length !== 5) {
          console.log("Enter a 5-letter word");
          return;
        }

        // if (!gameState.validWords.includes(gameState.curTry)) {
        //   console.log("Invalid word, please try a valid word");
        //   return;
        // }

        if (gameState.curTry.length === 5) {
          setGameState((prevTries) => {
            const newTry = [...prevTries.tries];
            newTry[prevTries.tries.findIndex((val) => val == null)] =
              gameState.curTry;
            return { ...prevTries, tries: newTry, curTry: "", curTryIndex: 0 };
          });
          console.log("Try has been set");
        }

        if (gameState.curTry === gameState.word) {
          setGameState((perState) => ({
            ...perState,
            isGameOver: true,
            isCorrect: true,
          }));
        }
      }

      if (e.key === "Backspace") {
        setGameState((perState) => ({
          ...perState,
          curTry: gameState.curTry.slice(0, -1),
          curTryIndex: Math.max(perState.curTryIndex - 1, 0),
        }));
        return;
      }

      if (/^[a-z]$/i.test(e.key)) {
        if (gameState.curTry.length < 5) {
          setGameState((perState) => ({
            ...perState,
            curTry: perState.curTry + e.key,
            curTryIndex: perState.curTryIndex + 1,
          }));
        } else {
          console.log("more words");
        }
      }
    }
    if (!isMobile) {
      window.addEventListener("keydown", handleTry);

      return () => window.removeEventListener("keydown", handleTry);
    }
  }, [gameState, isMobile]);

  useEffect(() => {
    // console.log(gameState.curTry);

    function failed() {
      console.log("tries ended");
      setGameState((perState) => ({
        ...perState,
        isGameOver: true,
        isCorrect: false,
      }));
    }
    if (
      gameState.tries.findIndex((val) => val == null) === -1 &&
      !gameState.isCorrect &&
      !gameState.isGameOver
    ) {
      failed();
    }
  }, [gameState]);

  useEffect(() => {
    async function fetchWord() {
      try {
        const res = await fetch(
          "https://api.datamuse.com/words?sp=?????&max=1000"
        );

        const data = await res.json();

        const ValidWords = data.map((value) => value.word);
        // console.log(ValidWords);

        const randomWord = data[Math.floor(Math.random() * data.length)].word;
        setGameState((perState) => ({
          ...perState,
          word: randomWord || "",
          validWords: ValidWords,
        }));
      } catch (error) {
        console.error("Error fetching word list", error);
      }
    }
    fetchWord();
  }, []);

  const handleMobileInput = (e) => {
    if (!isMobile) return;

    const value = e.target.value.toLowerCase();

    // Detect backspace (keyboard's X button)
    if (value.length < lastValue.current.length) {
      setGameState((prev) => ({
        ...prev,
        curTry: prev.curTry.slice(0, -1),
        curTryIndex: Math.max(prev.curTryIndex - 1, 0),
      }));
    }
    // Detect new character
    else if (value.length > lastValue.current.length) {
      const newChar = value.slice(-1);
      if (/^[a-z]$/.test(newChar) && gameState.curTry.length < 5) {
        setGameState((prev) => ({
          ...prev,
          curTry: prev.curTry + newChar,
          curTryIndex: prev.curTryIndex + 1,
        }));
      }
    }

    lastValue.current = value;
    e.target.value = ""; // Reset input
  };

  const handleMobileSubmit = () => {
    if (gameState.curTry.length === 5 && !gameState.isGameOver) {
      // Your existing submit logic
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
  };

  const handleScreenClick = () => {
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  };

  function resetGame() {
    setGameState({
      word: "",
      tries: Array(6).fill(null),
      curTry: "",
      isGameOver: false,
      isCorrect: null,
      curTryIndex: 0,
    });
  }

  return (
    <div className="app" onClick={handleScreenClick}>
      <h1>لعبة ووردل</h1>
      <h2>إهداء إلى إلين</h2>

      {/* Mobile Input */}
      {isMobile && (
        <div style={{ position: "relative" }}>
          <input
            ref={inputRef}
            type="text"
            onChange={handleMobileInput}
            style={{
              position: "fixed",
              top: "50%",
              left: 0,
              width: "100%",
              height: "60px",
              opacity: 0,
              zIndex: 10,
              fontSize: "16px",
            }}
            autoFocus
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
          />
          {/* Mobile Submit Button */}
          <button
            onClick={handleMobileSubmit}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              padding: "12px 24px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              zIndex: 10,
            }}
          >
            Submit
          </button>
        </div>
      )}

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
  );
}

export default App;
