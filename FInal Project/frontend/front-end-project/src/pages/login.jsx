import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'

function LoadingScreen() {
    return(
        <section className='loading-screen'>
            <h1>Please wait .....</h1>
            <h2>Checking Credentials</h2>
        </section>
    )
}

function LoginSystem() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setloading] = useState(false)
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function submitFunction(e) {
        setloading(true)
        setError('')
        e.preventDefault()
        let userData = {
            email: email,
            password: password,
        }

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            console.log('User loged in:', data);
            localStorage.setItem('user', JSON.stringify(data));

            setEmail('');
            setPassword('');
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
            <section className='login'>
                <form className='form-login' onSubmit={submitFunction}>

                    {loading && <LoadingScreen></LoadingScreen>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <p className='email-p'>Email: </p>
                    <input placeholder="abc@gmail.com" id="input-email" required name="input-email" type='email' value={email} onChange={(e) => setEmail(e.target.value)} ></input>

                    <p className='password-p'>Password: </p>
                    <input placeholder="••••••••" id="input-password" required name="input-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} ></input>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>

                </form>
            </section>
        </main>
    )
}

export default LoginSystem
