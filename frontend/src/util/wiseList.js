import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const WiseContext = createContext();

export const WiseProvider = ({ children }) => {
    const [wise, setWise] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/');
                setWise(res.data);
            } catch (error) {
                console.error('API 호출 오류:', error.message);
            }
        };
        getData();
    }, []);

    return (
        <WiseContext.Provider value={{ wise, setWise }}>
            {children}
        </WiseContext.Provider>
    );
};

export default WiseContext;