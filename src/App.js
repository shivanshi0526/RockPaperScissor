import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login, Home as Lobby, LeaderBoard, Game, WaitingList } from './Web/Componets/Pages';
import './App.css';

function App() {
  const [user, setUser] = useState({});
  const [playerAvailable, setPlayerAvailable] = useState(true);
  const [gameData, setGameData] = useState(
    JSON.parse(localStorage.getItem("gameData")) || {}
  );
  const [gameRequests, setGameRequests] = useState([]);

  const [gameSession, setGameSession] = useState();
  const [userChannel, setUserChannel] = useState()
  const [opponentChannel, setOpponentChannel] = useState();

  //session id to get sessionStorage data when game ends
  const [gameSessionID, setGameSessionID] = useState();
  
  const masterChannel = new BroadcastChannel("rock-paper-scissors-game");

  //idk if this should be on any useeffect
  // sets user status to offline when user closes tab
  window.onbeforeunload = () => {
    if(user.name) {
    setGameData({
      ...gameData,
      [user.name]: { ...user, available_for_game: "OFFLINE" },
    });
  }
  };

  useEffect(() => {
    masterChannel.addEventListener("message", (event) => {
      console.log(event);
      const currentGameData = JSON.stringify(gameData);
      const localGameData = localStorage.getItem("gameData");
      if (currentGameData !== localGameData)
        setGameData(JSON.parse(localGameData));
    });
  }, []);

  // update user availability or user cretation on localStorage
  useEffect(() => {
    console.log(user);
    if (user.name) {
      if (!gameData?.[user.name]) {
        const tempData = { ...gameData };
        tempData[user.name] = user;
        setGameData(tempData);
      } else {
        user.available_for_game = true;
        setGameData({ ...gameData, [user.name]: { ...user } });
      }
      setUserChannel(new BroadcastChannel(`${user.name}-channel`))
    }
  }, [user]);

  // attach listener when user channel initiates
  useEffect(()=>{
    console.log(userChannel);
    if(userChannel) userChannel.addEventListener("message", handleUserChannelMessages);
  },[userChannel])

  // handles all messages that comes to this user
  function handleUserChannelMessages(event) {
    console.log("handleUserChannelMessages", event);
    try {
      const opponentData = JSON.parse(event.data);
      if (opponentData.code == "GAME REQUEST") {
        setGameRequests([...gameRequests, opponentData]);
      } else if (opponentData.code == "GAME ACCEPT") {
        if (gameSession?.name !== opponentData.sessionID) {
          setGameSessionID(opponentData.sessionID)
          setGameSession(new BroadcastChannel(opponentData.sessionID));
        } else {
          setPlayerAvailable(false);
        }
      }
    } catch {
      console.log(event.data);
    }
  }

  // updates gameData on localStorage and send message to all other tabs to update
  useEffect(() => {
    console.log(gameData);
    const currentGameData = JSON.stringify(gameData);
    const localGameData = localStorage.getItem("gameData");
    if (currentGameData !== localGameData) {
      localStorage.setItem("gameData", JSON.stringify(gameData));
      masterChannel.postMessage("Game data has changed");
    }
  }, [gameData]);

  function sendGameRequest(opponent) {
    const requestChannel =
      opponentChannel?.name == `${opponent}-channel`
        ? opponentChannel
        : new BroadcastChannel(`${opponent}-channel`);
    requestChannel.postMessage(
      JSON.stringify({
        code: "GAME REQUEST",
        from: user.name,
      })
    );
    setOpponentChannel(requestChannel);
  }

  // create a session id and send to player who requested for game
  function acceptGameRequest(request) {
    let id = `game-${Math.round(Math.random() * 100000)}`;
    setGameSessionID(id)
    sessionStorage.setItem(id, `${user.name},${request.from}`);
    const requestChannel =
      opponentChannel?.name == `${request.from}-channel`
        ? opponentChannel
        : new BroadcastChannel(`${request.from}-channel`);
    setOpponentChannel(requestChannel);
    requestChannel.postMessage(
      JSON.stringify({
        code: "GAME ACCEPT",
        from: user.name,
        sessionID: id,
      })
    );
    // remove request from list as game has started
    console.log("gameRequests.indexOf(request)", gameRequests.indexOf(request));
    gameRequests.splice(gameRequests.indexOf(request), 1);
    console.log(gameRequests);

    // setting session id on state to use even after gameSession gets deleted
    setGameSession(new BroadcastChannel(id));
  }

  // players takes array of 2 player names
  function updatePlayerAvailablity(players, available = true) {
    setGameData({
      ...gameData,
      [players[0]]: { ...user, available_for_game: available },
      [players[1]]: {
        ...gameData[players[1]],
        available_for_game: available,
      }
    });
  }

  //handles game session init and destroy
  useEffect(() => {
    console.log(gameSession,"gamesession");
    if (gameSession) {
      setPlayerAvailable(false);
      user.available_for_game = false;
      // event listener when fires on the other tabs on game end
      gameSession.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.code == "END GAME") {
            setGameSession(null);
            setPlayerAvailable(true);
            const players = sessionStorage.getItem(gameSessionID)?.split(",");
            if (players) {
              updatePlayerAvailablity(players)
            }
          }
        } catch (error) {
          console.log(error);
        }
      });

      // update availability when game starts
      const players = sessionStorage.getItem(gameSession.name)?.split(",");
      if (players) {
        updatePlayerAvailablity(players, false)
      }
    } else if (user.name) {
      // when game ends on same tab
      setPlayerAvailable(true)
      const players = sessionStorage.getItem(gameSessionID)?.split(",");
      if (players) {
        updatePlayerAvailablity(players)
      }
    }
  }, [gameSession]);

  //to check if oppenent channel is open
  useEffect(() => {
    console.log(opponentChannel);
  }, [opponentChannel]);

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Login  user={user} 
        playerAvailable={playerAvailable} 
        gameData={gameData} 
        sendGameRequest={sendGameRequest} 
        gameRequests={gameRequests}
        acceptGameRequest={acceptGameRequest}
        setUser={setUser}
        
        />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game gameSession={gameSession}  gameData={gameData} user={user}  setUser={setUser}/>} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/waiting-list" element={<WaitingList />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
