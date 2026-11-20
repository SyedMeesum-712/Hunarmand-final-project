import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home.css'

function Home() {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [enrolledCount, setEnrolledCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser) {
            setUser(savedUser);
            fetch(`http://localhost:5000/enrollment/${savedUser._id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setEnrolledCount(data.length);
                    }
                })
                .catch(() => {});
        }

        fetch('http://localhost:5000/courses')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch courses');
                }
                return res.json();
            })
            .then((data) => {
                setCourses(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const user_logged_in = user !== null;
    const UserName = user ? user.name : '';

    if (user_logged_in === true) {
        return (
            <main>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <section className="user-Data">
                    <h1>Welcome {UserName}</h1>
                    <div className="data-Buttons">
                        <span id="data-button-1">Courses Available : <button>{courses.length}</button></span>
                        <span id="data-button-2">Courses Enrolled in : <button>{enrolledCount}</button></span>
                        <span id="data-button-3">Role : <button>{user.role || 'Student'}</button></span>
                        <span id="data-button-4">Account Status : <button>Active</button></span>
                    </div>
                </section>

                <section className="user-Data">
                    <h2>Recent Courses</h2>
                    {loading ? (
                        <p>Loading course data...</p>
                    ) : courses.length > 0 ? (
                        <ul>
                            {courses.slice(0, 5).map((course, index) => (
                                <li key={course._id || index}>
                                    {course.title || course.name} - {course.category || course.field || 'General'}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No courses found in database.</p>
                    )}

                    <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                        <Link to="/CourseDetails">View My Courses</Link>
                        <Link to="/CourseListing">Explore New Courses</Link>
                    </div>
                </section>
            </main>
        );
    } else {
        return (
            <main>
                <section className="user-Data">
                    <h1>Welcome to Learn Hub</h1>
                    <p>Please log in to view your data.</p>
                    <div style={{ marginTop: '15px' }}>
                        <Link to="/login">Login</Link>
                    </div>
                </section>
            </main>
        );
    }
}

export default Home;
