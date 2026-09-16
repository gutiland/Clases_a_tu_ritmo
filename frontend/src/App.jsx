import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import ClassDetails from './pages/ClassDetails/ClassDetails'
import Home from './pages/Home/Home'
import Catalog from './pages/Catalog/Catalog'
import { Login } from './pages/Login/Login'
import Register from './pages/Register/Register'
import CreateClass from './pages/CreateClass/CreateClass'
import MyWorkouts from './pages/MyWorkouts/MyWorkouts'
import { Routes, Route } from 'react-router'
import AdminPanel from './pages/AdminPanel/AdminPanel'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/classes/create" element={<CreateClass />} />
          <Route path="/classes/:id" element={<ClassDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-workouts" element={<MyWorkouts />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
