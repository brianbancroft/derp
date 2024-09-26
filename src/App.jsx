import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import bcrypt from "bcryptjs";

window.bcrypt = bcrypt;

// Function to hash and encode password
const hashAndEncodePassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const base64EncodedPassword = btoa(hashedPassword);
  return base64EncodedPassword;
};

function App() {
  const [count, setCount] = useState(0);

  async function test() {
    const payload = {
      password: {
        username: "test123",
        hash: await hashAndEncodePassword("password123"),
        email: "test123@mailinator.com",
        userId: "12345",
      },
    };

    window.payload = payload;

    const endpoint = `http://localhost:3000/auth/users`;

    // post request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(response);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const password = formData.get("password");
    const username = formData.get("username");
    const email = formData.get("email");
    const userId = formData.get("userId");

    const payload = {
      password: {
        username,
        hash: await hashAndEncodePassword(password),
        email,
        userId,
      },
    };

    console.log("payload", payload);

    const endpoint = `http://localhost:3000/auth/users`;

    // post request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      alert("Something went wrong");
      return;
    }

    const data = await response.json();

    if (data.alreadyExists) {
      alert("User already exists");
    } else {
      alert("User created");
    }
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="super-form">
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" />
        <label htmlFor="username">Username:</label>
        <input type="text" name="username" />
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" />
        <label htmlFor="userId">User ID:</label>
        <input type="text" name="userId" />
        <button type="submit">Submit</button>
      </form>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={test}>push the button</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
