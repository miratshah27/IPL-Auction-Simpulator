import{ useEffect } from 'react'
import { useNavigate } from 'react-router';

function Redirector() {
    const history = useNavigate();
    useEffect(() => {
        history(-1);
    }, [])
    return (
        <h1>Redirecting</h1>
    );
}

export default Redirector
