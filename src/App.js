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

  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef(null); // Added for mobile keyboard

  // Detect mobile device
  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, []);

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

  const handleInputChange = (e) => {
    if (!isMobile) return; // Only handle input changes on mobile

    const val = e.target.value
      .replace(/[^a-zA-Z]/g, "")
      .toLowerCase()
      .slice(0, 5);
    setGameState((prev) => ({
      ...prev,
      curTry: val,
      curTryIndex: val.length,
    }));
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

      {isMobile && (
        <input
          ref={inputRef}
          type="text"
          value={gameState.curTry}
          onChange={handleInputChange}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "1px",
            height: "1px",
            opacity: 0.01,
            zIndex: -1,
            direction: "ltr",
          }}
          autoFocus
          inputMode="text"
          autoComplete="off"
        />
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
