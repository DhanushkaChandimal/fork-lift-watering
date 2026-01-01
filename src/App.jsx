import { Route, Routes } from "react-router-dom"
import ForkliftDashboard from "./components/ForkliftDashboard"

function App() {
  return (
    <Routes>
      <Route path='/' element={<ForkliftDashboard/>}/>
    </Routes>
  )
}

export default App
