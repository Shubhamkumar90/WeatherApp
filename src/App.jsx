
import './App.css'
import Signup from './Component/Signup'
import Signin from './Component/Signin'
import WeatherCard from './Component/WeatherCard'
import PrivateRoute from './Component/PrivateRoute'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
function App() {
  

  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Signin />} ></Route>
    <Route path="/signup" element={<Signup />} ></Route>
    <Route path="/login" element={<Signin />} />
    <Route
      path="/weather"
      element={
        <PrivateRoute>
          <WeatherCard />
        </PrivateRoute>
      }
    />
  </Routes>
  </BrowserRouter>
  )
}

export default App
