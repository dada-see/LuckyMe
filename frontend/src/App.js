import { createContext, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import './styles/calendar.css';
import Home from './pages/home/Home';
import Calendar from './pages/calendar.js/Calendar';
import Join from './pages/auth/Join';
import Login from './pages/auth/Login';
import { WiseProvider } from './util/wiseList';
import axios from 'axios';

export const UserContext = createContext(null);

const App = () => {
    const [user, setUser] = useState(()=>{
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null; // localStorage에 데이터가 없으면 null 반환
    });

    const handleLogout = async () => {
        setUser(null);
        localStorage.removeItem('user');
        alert('로그아웃 되었습니다.');
        if(user){
            try {
                const response = await axios.post('http://localhost:3000/auth/logout', {
                    userKey: user.key
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = response.data
                if(data === "세션 삭제 완료"){
                    setUser(null);
                    localStorage.removeItem('user');
                    alert('로그아웃 되었습니다.');
                }
                // navigate('/login', { replace: true });
            } catch (error) {
                console.error('서버 오류:', error);
            }
        }
    };

    return (
        <UserContext.Provider value = {{user, setUser}}>
            <WiseProvider>
                <BrowserRouter>
                    <div className="App">
                        {user ? (
                            // 로그인 상태에서 접근 가능한 Routes
                            <Routes>
                                <Route path="/" element={<Home handleLogout={handleLogout} />} />
                                <Route path="/calendar" element={<Calendar />} />
                                {/* 잘못된 경로일때는 홈으로 */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        ) : (
                            // 비로그인 상태에서 접근 가능한 Routes
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/join" element={<Join />} />
                                {/* 잘못된 경로일때는 로그인으로 */}
                                <Route path="*" element={<Navigate to="/login" replace />} />
                            </Routes>
                        )}
                    </div>
                </BrowserRouter>
            </WiseProvider>
        </UserContext.Provider>
    );
}

export default App;
