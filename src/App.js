import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {AuthProvider} from "./context/auth";
import {PrivateRoute} from "./components/PrivateRoute";
import {Navbar} from "./components/Navbar"
import {Home} from "./pages/Home"
import { Register } from "./pages/Register";
import {Login} from "./pages/Login"
import {Profile} from "./pages/Profile"
import {AppContextProvider} from './context/AppContext'


function App() {
  return (
    <AuthProvider>
      <AppContextProvider>
        <BrowserRouter>
            <Navbar/>
              <Routes>
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </AuthProvider>
  );
}

export default App;
