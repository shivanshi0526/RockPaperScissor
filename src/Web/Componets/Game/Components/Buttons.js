import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

export default function Buttons({ showModal, setMode, mode, choice }) {
  const [isFading, setIsFading] = useState(true);

  useEffect(() => {
    setIsFading(prevFade => !prevFade);
  }, [choice]);

  return (
    <CSSTransition in={isFading} appear timeout={1000} classNames='buttonsFade'>
      <div className="btnContainer">
        <button className="game_btn btn font-600" aria-label='change game mode'
          onClick={() => mode ? setMode(0) : setMode(1)}>mode</button>
        <button className="btn rules_btn font-600"
          onClick={() => showModal(true)}>rules</button>
      </div>
    </CSSTransition>
  );
}
