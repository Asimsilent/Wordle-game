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






const [isMobile, setIsMobile] = useState(false);
const inputRef = useRef(null);

// Detect mobile device
useEffect(() => {
  setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}, []);

// Modified handleTry to prevent double input
useEffect(() => {
  function handleTry(e) {
    if (gameState.isGameOver || isMobile) return; // Skip if mobile

    // ... rest of your existing handleTry logic
  }

  if (!isMobile) {
    window.addEventListener("keydown", handleTry);
    return () => window.removeEventListener("keydown", handleTry);
  }
}, [gameState, isMobile]);

// Modified input change handler
const handleInputChange = (e) => {
  if (!isMobile) return; // Only handle input changes on mobile
  
  const val = e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase().slice(0, 5);
  setGameState(prev => ({
    ...prev,
    curTry: val,
    curTryIndex: val.length
  }));
};