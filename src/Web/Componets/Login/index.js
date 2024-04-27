import { useEffect, useState } from "react";
import "./login.css"

export default function Auth({ setUser }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowpassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [userNameLengthError, setUserNameLengthError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);

  function loadUserData(name) {
    debugger
    const gameData = JSON.parse(localStorage.getItem("gameData"))
    return (
      gameData?.[name] || {
        name,
        password,
        wins: 0,
        loss: 0,
        available_for_game: true
      }
    );
  }

  function handleUserSubmit(e) {
    e.preventDefault();
    if(userName.length == 0) {
      setUserNameLengthError(true)
      return
    }
    if(password.length == 0) {
      setPasswordLengthError(true);
      return
    }
    const currentUser = loadUserData(userName);
    if (password == currentUser.password) {
      setUser(currentUser);
      setUserName("");
      setPassword("");
    } else {
      setPasswordError(true);
      document.getElementById("password").focus();
      document.getElementById("password").select();
    }
  }

  function handleNameChange(e) {
    setUserName(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  return (
    <>
      <h1>Login / Signup</h1>
      <form action="/login" onSubmit={handleUserSubmit}>
        <label htmlFor="login">Username</label>
        <input
          name="login"
          id="login"
          type="text"
          onChange={handleNameChange}
          value={userName}
        />
        {userNameLengthError && 
        <span> Username cannot be empty</span>
}
        <label htmlFor="password">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          onChange={handlePasswordChange}
          value={password}
        />
        {passwordLengthError ? <span>Password cannot be empty</span> : passwordError && <span>Please enter the correct password</span>}
        <input
          type="checkbox"
          name="showPassword"
          id="showPassword"
          onChange={() => setShowpassword(!showPassword)}
          value={showPassword}
        />
        <label htmlFor="showPassword">Show Password</label>
        <input type="submit" />
      </form>
    </>
  );
}
