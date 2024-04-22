import React from 'react'
import Auth from '../Login';
import { useNavigate } from "react-router-dom";

export default function Login({user,sendGameRequest,gameRequests,playerAvailable,setUser,gameData,acceptGameRequest}) {
  const navigate = useNavigate()
  return (
    <div>
         {user.name && playerAvailable ? (
        <>
          <h1>Welcome to the game {user.name}</h1>
          <ul>
            {Object.values(gameData).map(
              (userData, index) =>
                user.name != userData.name && (
                  <li key={index}>
                    <span>{userData.name}</span>
                    <button
                      onClick={() => sendGameRequest(userData.name)}
                      disabled={!userData.available_for_game}
                    >
                      {userData.available_for_game ? "Play" : "In game"}
                    </button>
                  </li>
                )
            )}
          </ul>
          <br />
          {gameRequests.length ? (
            <>
              <h2>Requests</h2>
              <ul>
                {gameRequests.map((request) => (
                  <li key={request.sessionID}>
                    <span>{request.from}</span>
                    <button onClick={() => acceptGameRequest(request)}>
                      Accept
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <h2>No requests</h2>
          )}
        </>
      ) : user.name && !playerAvailable ? (
        navigate('/game')
        // <Game gameSession={gameSession} />
      ) : (
        <Auth setUser={setUser} gameData={gameData} />
      )}
    </div>
  )
}
