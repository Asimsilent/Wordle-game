// if (e.key === "Enter") {
//   if (curTry.length !== 5) {
//     console.log("enter for unfill");
//     return;
//   }

//   setTries((prevTries) => {
//     const newTry = [...prevTries];
//     newTry[prevTries.findIndex((val) => val == null)] = curTry;
//     return newTry;
//   });

//   console.log("try has been set");
//   setCurrentTry(""); // Clear current input after setting it

//   if (curTry === word) {
//     setIsGameOver(true);
//     setIscorrect(true);
//   }
// }

//using failing to complete game
// useEffect(() => {
//   if (tries.findIndex((val) => val == null) === -1) {
//     setTimeout(() => {
//       if (!isCorrect) {
//         failed();
//       }
//     }, 0); // Delays execution to ensure state updates first
//   }
// }, [tries, isCorrect]);





// if (/^[a-z]$/i.test(e.key)) {
//   if (curTry.length < 5) {  // Prevents adding more than 5 characters
//     setCurrentTry((prev) => prev + e.key);
//   } else {
//     console.log("Cannot type more than 5 letters");
//   }
// }