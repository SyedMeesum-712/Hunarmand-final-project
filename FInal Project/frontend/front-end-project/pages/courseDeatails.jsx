import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './courseDeatails.css';

function CourseDetails() {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [userCourses, setUserCourses] = useState([]);
    const [instructorCourses, setInstructorCourses] = useState([]);
    const [viewMode, setViewMode] = useState('enrolled');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    function calculateExpectedDate(durationStr, startDateStr) {
        let weeks = 8;
        if (typeof durationStr === 'number') {
            weeks = durationStr;
        } else if (typeof durationStr === 'string') {
            const match = durationStr.match(/\d+/);
            if (match) {
                weeks = parseInt(match[0], 10);
            }
        }
        const target = startDateStr ? new Date(startDateStr) : new Date();
        target.setDate(target.getDate() + (weeks * 7));
        return target.toISOString().split('T')[0];
    }

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (!savedUser) {
            setUserLoggedIn(false);
            setLoading(false);
            return;
        }

        setUserLoggedIn(true);
        setUser(savedUser);
        if (savedUser.role === 'instructor') {
            setViewMode('created');
        } else {
            setViewMode('enrolled');
        }

        const fetchEnrollments = fetch(`http://localhost:5000/enrollment/${savedUser._id}`).then((res) => res.json());
        const fetchAllCourses = fetch('http://localhost:5000/courses').then((res) => res.json());

        Promise.all([fetchEnrollments, fetchAllCourses])
            .then(([enrolledData, coursesData]) => {
                setUserCourses(Array.isArray(enrolledData) ? enrolledData : []);
                if (Array.isArray(coursesData)) {
                    const created = coursesData.filter((c) =>
                        (c.instructor && (c.instructor._id === savedUser._id || c.instructor === savedUser._id)) ||
                        (c.instructorName && savedUser.name && c.instructorName.toLowerCase() === savedUser.name.toLowerCase())
                    );
                    setInstructorCourses(created);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    async function handleUpdateModule(item, change) {
        const course = item.course || {};
        let totalMods = course.modules || 5;
        let currentCompleted = item.completedModules || 0;
        let newCompleted = Math.max(0, Math.min(totalMods, currentCompleted + change));

        try {
            const res = await fetch('http://localhost:5000/enrollment/progress', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user._id,
                    courseId: course._id,
                    completedModules: newCompleted
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to update progress');
            }

            setUserCourses(data);
        } catch (err) {
            alert(err.message);
        }
    }

    if (loading) {
        return (
            <main>
                <section className="course-Details">
                    <p>Loading course details...</p>
                </section>
            </main>
        );
    }

    if (!userLoggedIn) {
        return (
            <main>
                <section className="course-Details">
                    <h1>Course Details</h1>
                    <p>Please log in to view course details.</p>
                </section>
            </main>
        );
    }

    const isInstructor = user && user.role === 'instructor';

    return (
        <main>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <section className="courses-enrolled">
                {isInstructor && (
                    <div className="instructor-bar">
                        <span className="instructor-status">
                            Current Status: Logged in as <strong>Instructor</strong> &bull; Showing: <strong>{viewMode === 'created' ? 'Your Courses' : 'Courses Enrolled'}</strong>
                        </span>
                        <button
                            className="switch-view-btn"
                            onClick={() => setViewMode(viewMode === 'created' ? 'enrolled' : 'created')}
                        >
                            {viewMode === 'created' ? 'Switch to Courses Enrolled' : 'Switch to Your Courses'}
                        </button>
                    </div>
                )}

                {viewMode === 'created' ? (
                    <>
                        <h1>Your Courses</h1>
                        {instructorCourses.length === 0 ? (
                            <div className="no-courses-message">
                                <p>You have not listed any courses yet.</p>
                                <Link to="/CourseListing">
                                    <button className="browse-courses-btn">Go to Course Listings to Add</button>
                                </Link>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Course Name</th>
                                        <th>Field</th>
                                        <th>Duration</th>
                                        <th>Total Modules</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {instructorCourses.map((course, index) => (
                                        <tr key={course._id || index}>
                                            <td>{course.title}</td>
                                            <td>{course.category || 'General'}</td>
                                            <td>{course.duration || '8 Weeks'}</td>
                                            <td>{course.modules || 5}</td>
                                            <td>${course.price || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                ) : (
                    <>
                        <h1>Courses Enrolled</h1>
                        {userCourses.length === 0 ? (
                            <div className="no-courses-message">
                                <p>No course enrolled. Please add courses to see the course details.</p>
                                <Link to="/CourseListing">
                                    <button className="browse-courses-btn">Go to Course Listings</button>
                                </Link>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Course Name</th>
                                        <th>Instructor</th>
                                        <th>Duration</th>
                                        <th>Date Joining</th>
                                        <th>Expected Completion Date</th>
                                        <th>Modules Completed</th>
                                        <th>Current Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userCourses.map((item, index) => {
                                        const course = item.course || {};
                                        const instructor = course.instructorName || course.instructor?.name || 'Instructor';
                                        const total = course.modules || 5;
                                        const completed = item.completedModules || 0;
                                        const progress = Math.round((completed / total) * 100);

                                        return (
                                            <tr key={item._id || index}>
                                                <td>{course.title || 'Untitled Course'}</td>
                                                <td>{instructor}</td>
                                                <td>{course.duration || '8 Weeks'}</td>
                                                <td>{item.dateJoining || 'N/A'}</td>
                                                <td>{calculateExpectedDate(course.duration, item.dateJoining)}</td>
                                                <td>
                                                    <div className="module-control">
                                                        <span>{completed} / {total}</span>
                                                        <button
                                                            onClick={() => handleUpdateModule(item, 1)}
                                                            disabled={completed >= total}
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateModule(item, -1)}
                                                            disabled={completed <= 0}
                                                        >
                                                            -
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>{progress}%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}

export default CourseDetails;
