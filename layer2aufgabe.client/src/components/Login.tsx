import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode'; // jwtDecode importieren

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async () => {
        try {
            const response = await fetch('https://localhost:7073/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();

                const token = data.token.result;

                if (typeof token !== 'string') {
                    throw new Error('Invalid token format');
                }

                localStorage.setItem('token', token);

                const decoded: any = jwtDecode(token);
                const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

                localStorage.setItem('role', role); 
                const extractedUsername = decoded.sub; 

                localStorage.setItem('username', extractedUsername);

                window.location.href = '/';
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Fehler beim Login:', error);
            alert('Fehler beim Login: ' + error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Login</h2>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </div>
                    <button onClick={handleLogin} className="btn btn-primary mt-4 w-100">
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
