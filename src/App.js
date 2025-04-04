import { useEffect, useState } from "react";
import Line from "./components/Line";

function App() {
  const [gameState, setGameState] = useState({
    word: "",
    tries: Array(6).fill(null),
    curTry: "",
    isGameOver: false,
    isCorrect: null,
  });

  useEffect(() => {
    function handleTry(e) {
      if (gameState.isGameOver) {
        return;
      }

      if (e.key === "Enter") {
        if (gameState.curTry.length !== 5) {
          console.log("enter for unfill");
          return;
        }

        if (gameState.curTry.length === 5) {
          setGameState((prevTries) => {
            const newTry = [...prevTries.tries];
            newTry[prevTries.tries.findIndex((val) => val == null)] =
              gameState.curTry;
            return { ...prevTries, tries: newTry, curTry: "" };
          });
          console.log("try has been set");
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
        }));
        return;
      }

      if (/^[a-z]$/i.test(e.key)) {
        if (gameState.curTry.length < 5) {
          setGameState((perState) => ({
            ...perState,
            curTry: perState.curTry + e.key,
          }));
        } else {
          console.log("more words");
        }
      }
    }
    window.addEventListener("keydown", handleTry);

    return () => window.removeEventListener("keydown", handleTry);
  }, [gameState]);

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
      !gameState.isCorrect && !gameState.isGameOver
    ) {
      failed();
    }
  }, [gameState]);

  useEffect(() => {
    async function fetchWord() {
      const res = await fetch("/words.json");
      const data = await res.json();
      const randomWord = data[Math.floor(Math.random() * data.length)];
      setGameState((perState) => ({ ...perState, word: randomWord }));
    }
    fetchWord();
  }, [gameState.word]);

  function resetGame() {
    setGameState({
      word: "",
      tries: Array(6).fill(null),
      curTry: "",
      isGameOver: false,
      isCorrect: null,
    });
  }

  return (
    <div className="app">
      <h1>Worlde Game</h1>
      {gameState.tries.map((attempt, i) => {
        const isCurrentGuess =
          i === gameState.tries.findIndex((val) => val == null);
        return (
          <Line
            key={i}
            attempt={isCurrentGuess ? gameState.curTry : attempt ?? ""}
            isFinal={!isCurrentGuess && attempt != null}
            word={gameState.word}
          />
        );
      })}
      {gameState.isCorrect === true && (
        <p>
          You have won the game in{" "}
          {gameState.tries.findIndex((val) => val == null) === -1
            ? 6
            : gameState.tries.findIndex((val) => val == null)}{" "}
          attempt
        </p>
      )}

      {gameState.isCorrect === false && (
        <>
          {" "}
          <p>You have lost the game, you tries ended</p>
          <p>Correct word is {gameState.word}</p>
        </>
      )}
      <button onClick={resetGame}>Reset game</button>
    </div>
  );
}

export default App;
