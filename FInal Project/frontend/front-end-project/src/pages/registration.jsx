import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './registration.css'

function LoadingScreen() {
    return(
        <section className='loading-screen'>
            <h1>Please wait .....</h1>
            <h2>Checking Credentials</h2>
        </section>
    )
}

function RegistrationSystem() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setloading] = useState(false)
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function submitFunction(e) {
        setloading(true)
        setError('')
        e.preventDefault()
        let userData = {
            name: username,
            email: email,
            password: password,
            role: role
        }

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            console.log('User registered:', data);
            localStorage.setItem('user', JSON.stringify(data));

            setUsername('');
            setEmail('');
            setPassword('');
            setRole('student');
            navigate('/');
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setloading(false);
        }
    }

    return (
        <main className='login-page'>
            <section className='Registration'>
                <form className='form-registration' onSubmit={submitFunction}>

                    {loading && <LoadingScreen></LoadingScreen>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <p className='username-p'>User Name: </p>
                    <input placeholder="Jhon Smith" id="input-username" required name="input-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} ></input>

                    <p className='email-p'>Email: </p>
                    <input placeholder="abc@gmail.com" id="input-email" required name="input-email" type='email' value={email} onChange={(e) => setEmail(e.target.value)} ></input>

                    <p className='password-p'>Password: </p>
                    <input placeholder="••••••••" id="input-password" required name="input-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} ></input>

                    <p className='role-p'>Role: </p>
                    <label>
                        <input type='radio' name='role' value='instructor' checked={role == 'instructor'} onChange={(e) => setRole(e.target.value)}></input>
                        Instructor
                    </label>
                    <label>
                        <input type='radio' name='role' value='student' checked={role == 'student'} onChange={(e) => setRole(e.target.value)}></input>
                        Student
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                </form>
            </section>
        </main>
    )
}

export default RegistrationSystem
