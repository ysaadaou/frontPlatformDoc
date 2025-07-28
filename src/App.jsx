import { Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
