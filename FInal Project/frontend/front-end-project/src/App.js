import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import CourseListing from './pages/courseListings'
import CourseDetails from './pages/courseDeatails'
import LoginSystem from './pages/login'
import RegistrationSystem from './pages/registration'

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'))

  function handleLogout() {
    localStorage.removeItem('user')
    navigate('/')
    window.location.reload()
  }

  return (
    <nav>
      <div className="logo"> LEARN HUB </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/CourseListing">Course Listing</Link></li>
        <li><Link to="/CourseDetails">Course Details</Link></li>
        {user ? (
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

function About() {
  return (
    <main style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>About Learn Hub</h1>
      <p>Welcome to Learn Hub. We provide high quality computer science and software engineering courses.</p>
    </main>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" style={{ color: '#4f46e5' }}>Back to Home</Link>
    </div>
  );
}

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/CourseListing" element={<CourseListing />} />
        <Route path="/courses" element={<CourseListing />} />
        <Route path="/CourseDetails" element={<CourseDetails />} />
        <Route path="/details" element={<CourseDetails />} />
        <Route path="/login" element={<LoginSystem />} />
        <Route path="/register" element={<RegistrationSystem />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
