import reactLogo from "./assets/react.svg";
import "./App.css";

import bcrypt from "bcryptjs";

window.bcrypt = bcrypt;

// get bearer token from localstorage

const token = localStorage.getItem("bearer-token");

// Function to hash and encode password
const hashAndEncodePassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const base64EncodedPassword = btoa(hashedPassword);
  return base64EncodedPassword;
};

function App() {
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const password = formData.get("password");
    const username = formData.get("username");
    const email = formData.get("email");
    const userId = formData.get("userId");
    const bearerToken = formData.get("bearerToken");

    localStorage.setItem("bearer-token", bearerToken);

    const payload = {
      username,
      hash: await hashAndEncodePassword(password),
      email,
      userId,
    };

    console.log("payload", payload);

    const endpoint = `http://localhost:3000/auth/users`;

    // post request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
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
        <input required type="password" name="password" />
        <label htmlFor="username">Username:</label>
        <input required type="text" name="username" />
        <label htmlFor="email">Email:</label>
        <input required type="email" name="email" />
        <label htmlFor="userId">User ID:</label>
        <input required type="text" name="userId" />
        <label htmlFor="bearerToken">Bearer Token</label>
        <input required type="text" name="bearerToken" defaultValue={token} />
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
    </div>
  );
}

export default App;
