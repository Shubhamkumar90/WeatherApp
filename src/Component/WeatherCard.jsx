import React, { useState,useEffect } from "react";
import { FaMicrophone, FaVolumeUp } from "react-icons/fa";
import Spinner from "./Spinner";

const WeatherCard = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [cityImage, setCityImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [greeting, setGreeting] = useState("");
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("weather_user"));
    // console.log(user)
    if (user && user.isLoggedIn && isFirstTime) {
      setGreeting(`Welcome back, ${user[0].name}!`);
      // setIsFirstTime(false);
    }
  }, [isFirstTime]);
  const fetchWeather = async () => {
    if (!city) return;
    setIsFirstTime(false);
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeather(data);
      setError(null);
      fetchBackgroundImage(data.weather[0].main);
      fetchCityImage(city);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setBackgroundImage("");
      setCityImage("");
    } finally {
      setLoading(false);
    }
  };

  const fetchBackgroundImage = async (weatherCondition) => {
    let query = weatherCondition.toLowerCase();
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        setBackgroundImage(data.results[0].urls.regular);
      } else {
        setBackgroundImage("");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setBackgroundImage("");
    }
  };

  const fetchCityImage = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        setCityImage(data.results[0].urls.regular);
      } else {
        setCityImage("");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setCityImage("");
    }
  };

  const handleVoiceSearch = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event) => {
      const spokenCity = event.results[0][0].transcript.replace(/\.$/, "");
      setCity(spokenCity);
      setIsListening(false);
      fetchWeather();
    };

    recognition.onerror = (event) => {
      setError("Voice recognition error: " + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const speakWeather = () => {
    if (!weather) return;
    const text = `Weather in ${weather.name}: ${weather.weather[0].description}, temperature is ${weather.main.temp} degrees Celsius, feels like ${weather.main.feels_like}, humidity is ${weather.main.humidity} percent, wind speed is ${weather.wind.speed} meters per second.`;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div
      className="flex flex-col items-center bg-gray-200"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Search Bar */}
      <div className="w-full bg-gray-700 p-4 flex justify-center shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="relative w-2/3">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 pr-10 border rounded-md"
          />
          <button
            onClick={handleVoiceSearch}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${isListening ? "animate-ping text-red-600" : "text-gray-600 hover:text-blue-600"}`}
          >
            <FaMicrophone size={20} />
          </button>
        </div>
        <button
          onClick={fetchWeather}
          className="bg-white text-gray-700 px-4 py-2 rounded-md font-semibold ml-2"
        >
          Search
        </button>
      </div>
      {isFirstTime&&greeting && (
        <div className="">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-200 text-green-900 px-8 py-4 rounded-lg shadow-lg text-xl font-semibold z-20">
          {greeting}
        </div>
        </div>
      )}
      {error && <p className="text-red-500 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-semibold ">{error}</p>}
      {loading && <Spinner />}

      {weather && (
        <div className="w-3/4 p-10 mt-20 mb-10 shadow-lg bg-white bg-opacity-90 rounded-2xl text-center space-y-6 relative">
          <div
            className="w-full h-60 flex justify-center items-center rounded-lg relative"
            style={{
              backgroundImage: cityImage ? `url(${cityImage})` : "",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex flex-col">
              <div>
                <h3 className="text-4xl font-bold text-yellow-300 drop-shadow-lg relative bg-black bg-opacity-50 p-2 rounded">
                  {weather.name}, {weather.sys.country}
                </h3>
              </div>
              <div className="relative flex justify-center items-center">
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="w-28 h-28 relative"
                />
                <p className="text-5xl font-bold relative text-blue-500">
                  {weather.main.temp}°C
                </p>
              </div>
            </div>
          </div>
          <p className="text-xl capitalize text-gray-700 font-semibold">
            {weather.weather[0].description}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-lg p-6 bg-gray-300 rounded-lg">
            <div className="p-4 bg-white rounded-lg shadow flex items-center">
              Humidity: {weather.main.humidity}%
            </div>
            <div className="p-4 bg-white rounded-lg shadow flex items-center">
              Wind Speed: {weather.wind.speed} m/s
            </div>
            <div className="p-4 bg-white rounded-lg shadow flex items-center">
              Pressure: {weather.main.pressure} hPa
            </div>
            <div className="p-4 bg-white rounded-lg shadow flex items-center">
              Feels Like: {weather.main.feels_like}°C
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={speakWeather}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2"
            >
              <FaVolumeUp /> Speak Weather
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
