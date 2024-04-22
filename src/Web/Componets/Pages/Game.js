import React from 'react'
import GamePage from '../Game'

export default function Game({gameSession, gameData, user,  setUser}) {
  return (
    <div>
        Game
        <GamePage gameSession={gameSession}  gameData={gameData} user={user}  setUser={setUser}/>
    </div>
  )
}
