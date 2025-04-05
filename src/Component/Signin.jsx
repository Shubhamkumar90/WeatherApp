import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(localStorage.getItem("weather_user"))
    if(localStorage.getItem("weather_user")){
    const user = JSON.parse(localStorage.getItem("weather_user"));
    if (user && user.isLoggedIn) {
      navigate("/weather"); // Redirect if already logged in
    }}
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("users"));

    if (!storedUser) {
      alert("No user found. Please sign up first.");
      return;
    }
    let nstoredUser=storedUser.filter((user)=>{return user.email==email&&user.password==password})
    // console.log(nstoredUser[0])
    if (nstoredUser) {
      localStorage.setItem(
        "weather_user",
        JSON.stringify({ ...nstoredUser, isLoggedIn: true })
      );
      alert(`Welcome ${nstoredUser[0].name}!`);
      navigate("/weather");
    } else {
      alert("Invalid credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
