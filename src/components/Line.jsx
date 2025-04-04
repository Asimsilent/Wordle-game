const ATTEMPT_LENGTH = 5;

function Line({ attempt, isFinal, word, curTryIndex }) {
  const getLetterStates = () => {
    const secretLetters = [...word];
    const guessLetters = [...attempt];
    const result = Array(5).fill("incorrect");

    // First pass: Mark correct letters and remove them from consideration
    for (let i = 0; i < ATTEMPT_LENGTH; i++) {
      if (guessLetters[i] === secretLetters[i]) {
        result[i] = "correct";
        secretLetters[i] = null; // Remove exact matches from pool
      }
    }

    for (let i = 0; i < ATTEMPT_LENGTH; i++) {
      if (result[i] === "incorrect") {
        const findIndex = secretLetters.findIndex(
          (char, index) => char === guessLetters[i]
        );

        if (findIndex > -1) {
          result[i] = "close";
          secretLetters[findIndex] = null;
        }
      }
    }
    return result;
  };
  return (
    <div className="line">
      {Array(5)
        .fill()
        .map((_, i) => {
          const char = attempt[i] || "";
          const state = isFinal ? getLetterStates()[i] : "";
          const isCurActive = i === curTryIndex;
          return (
            <div
              key={i}
              className={`box ${state} ${isCurActive ? "active" : ""}`}
              data-testid={`letter-${i}`}
            >
              {char}
            </div>
          );
        })}
    </div>
  );
}

export default Line;

// const ATTEMPT_LENGTH = 5;

// function Line({ attempt, isFinal, word }) {
//   const letters = [];

//   for (let i = 0; i < ATTEMPT_LENGTH; i++) {
//     const char = attempt[i];
//     let className = "box";

//     if (isFinal) {
//       if (char === word[i]) {
//         className += " correct";
//       } else if (word.includes(char)) {
//         className += " close";
//       } else {
//         className += " incorrect";
//       }
//     }

//     letters.push(
//       <div key={i} className={className}>
//         {char}
//       </div>
//     );
//   }

//   return <div className="line">{letters}</div>;
// }

// export default Line;
