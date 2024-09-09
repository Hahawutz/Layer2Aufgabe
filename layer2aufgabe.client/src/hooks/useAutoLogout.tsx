import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = () => {
            localStorage.removeItem('token');
            navigate('/login');
        };

        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp * 1000;
                if (Date.now() >= tokenExpiration) {
                    handleLogout();
                }
            }
        };

        const interval = setInterval(checkTokenExpiration, 10000); 

        return () => clearInterval(interval); 
    }, [navigate]);
};

export default useAutoLogout;
