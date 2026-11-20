import { useState, useEffect } from 'react';
import './courseListings.css';

function CourseListing() {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showAddCourse, setShowAddCourse] = useState(false);
    const [title, setTitle] = useState('');
    const [instructorName, setInstructorName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [modules, setModules] = useState('');

    function calculateExpectedDate(durationStr, startDate = new Date()) {
        let weeks = 8;
        if (typeof durationStr === 'number') {
            weeks = durationStr;
        } else if (typeof durationStr === 'string') {
            const match = durationStr.match(/\d+/);
            if (match) {
                weeks = parseInt(match[0], 10);
            }
        }
        const target = new Date(startDate);
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
        if (savedUser.name) {
            setInstructorName(savedUser.name);
        }

        Promise.all([
            fetch('http://localhost:5000/courses').then((res) => res.json()),
            fetch(`http://localhost:5000/enrollment/${savedUser._id}`).then((res) => res.json())
        ])
            .then(([coursesData, enrolledData]) => {
                setAvailableCourses(coursesData);
                let ids = Array.isArray(enrolledData)
                    ? enrolledData.map((e) => e.course?._id || e.course)
                    : [];
                setEnrolledIds(ids);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    async function handleAddCourse(e) {
        e.preventDefault();

        let durationStr = duration.trim();
        if (!durationStr.toLowerCase().includes('week')) {
            durationStr = `${durationStr} Weeks`;
        }

        const newCourseData = {
            title: title,
            instructorName: instructorName || user?.name || 'Instructor',
            description: description,
            category: category,
            duration: durationStr,
            price: Number(price) || 0,
            modules: Number(modules) || 5,
            instructor: user?._id || undefined
        };

        try {
            const res = await fetch('http://localhost:5000/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCourseData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to list course');
            }

            const createdCourse = await res.json();
            setAvailableCourses([...availableCourses, createdCourse]);
            setTitle('');
            setDescription('');
            setCategory('');
            setDuration('');
            setPrice('');
            setModules('');
            setShowAddCourse(false);
            alert('Course listed successfully!');
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleEnroll(course) {
        try {
            const res = await fetch('http://localhost:5000/enrollment/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, courseId: course._id })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to enroll');
            }

            let ids = data.map((e) => e.course?._id || e.course);
            setEnrolledIds(ids);
            alert(`Successfully enrolled in ${course.title}!`);
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleUnenroll(course) {
        const confirmed = window.confirm("Are you sure? This decision cannot be reversed and your progress will be lost.");
        if (!confirmed) {
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/enrollment/unenroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, courseId: course._id })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to unenroll');
            }

            let ids = data.map((e) => e.course?._id || e.course);
            setEnrolledIds(ids);
            alert(`Unenrolled from ${course.title}`);
        } catch (err) {
            alert(err.message);
        }
    }

    if (loading) {
        return (
            <main>
                <section className="courses-listing">
                    <p>Loading available courses...</p>
                </section>
            </main>
        );
    }

    if (!userLoggedIn) {
        return (
            <main>
                <section className="courses-listing">
                    <h1>Courses Listing</h1>
                    <p>Please log in to view available courses.</p>
                </section>
            </main>
        );
    }

    const isInstructor = user && user.role === 'instructor';

    return (
        <main>
            <section className="courses-listing">
                <div className="course-listing-header">
                    <h1>Courses Listing</h1>
                    <p>Below is a table of all available courses. Please click on enroll button to enroll on the selected course.</p>
                </div>

                {isInstructor ? (
                    <>
                        <button className="toggle-form-btn" onClick={() => setShowAddCourse(!showAddCourse)}>
                            {showAddCourse ? 'Cancel' : '+ List a New Course'}
                        </button>

                        {showAddCourse && (
                            <form className="add-course-form" onSubmit={handleAddCourse}>
                                <h3>List a New Course</h3>
                                <input
                                    type="text"
                                    placeholder="Course Title"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Instructor Name"
                                    required
                                    value={instructorName}
                                    onChange={(e) => setInstructorName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Course Description"
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Category / Field (e.g. Web Development)"
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Course Length (e.g. 8 Weeks)"
                                    required
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Price ($)"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Total Modules (e.g. 5)"
                                    min="1"
                                    required
                                    value={modules}
                                    onChange={(e) => setModules(e.target.value)}
                                />
                                <button type="submit">Submit Course</button>
                            </form>
                        )}
                    </>
                ) : (
                    <div className="reserved-notice">
                        <p>Reserved for instructors</p>
                    </div>
                )}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Duration</th>
                            <th>Field</th>
                            <th>Total Modules</th>
                            <th>Price</th>
                            <th>Expected Completion Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableCourses.map((course, index) => {
                            const isEnrolled = enrolledIds.includes(course._id);

                            return (
                                <tr key={course._id || index}>
                                    <td>{course.title}</td>
                                    <td>{course.duration || '8 Weeks'}</td>
                                    <td>{course.category || 'General'}</td>
                                    <td>{course.modules || 5}</td>
                                    <td>${course.price || 0}</td>
                                    <td>{calculateExpectedDate(course.duration || '8 Weeks')}</td>
                                    <td>
                                        {isEnrolled ? (
                                            <button
                                                className="unenroll-btn"
                                                onClick={() => handleUnenroll(course)}
                                            >
                                                Unenroll
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEnroll(course)}
                                            >
                                                Enroll
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>
        </main>
    );
}

export default CourseListing;
