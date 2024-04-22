import React, { useState, useEffect } from "react";
import Header from "./Components/Header"
import GameGrid from './Components/GameGrid';
import Modal from './Components/Modal';
import Buttons from "./Components/Buttons";
import { gameModes } from './data.js'; // Assuming data.js is the JavaScript file
import './index.css';

function GamePage({gameSession, gameData, user,  setUser}) {
  const [score, setScore] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [choice, setChoice] = useState(undefined);
  const [currentGameArr, setCurrentGameArr] = useState([]);
  const [mode, setMode] = useState(0);

  let currentMode = gameModes[mode];
  console.log(currentGameArr,"currentGameArr",choice)

  useEffect(() => changeMode(), [mode]);
  useEffect(() => createWinConditionsArr(), [choice]);

  return (
    <main>
      <Header
        score={score}
        mode={mode}
        altText={currentMode.options.join(', ')} />

      <GameGrid
        mode={mode}
        choice={choice}
        setChoice={setChoice}
        setScore={setScore}
        currentGameArr={currentGameArr} />

      <Buttons
        setMode={setMode}
        mode={mode}
        choice={choice}
        showModal={setIsModal} />

      <Modal
        currentMode={currentMode}
        modalOpen={isModal}
        closeModal={() => setIsModal(false)} />
    </main>
  );

  function changeMode() {
    currentMode = gameModes[mode];
    setChoice(undefined);
  }

  function createWinConditionsArr() {
    let { options } = currentMode;
    console.log(options,choice)
    if (choice) {
      const choiceIndex = options.indexOf(choice);
      const gameArr = options.slice(choiceIndex)
        .concat(options.slice(0, choiceIndex));
        console.log(gameArr)
      setCurrentGameArr(gameArr);
    }
  }
}

export default GamePage;
