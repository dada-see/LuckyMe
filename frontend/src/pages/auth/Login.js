import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../App';

const Login =()=>{
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { setUser } = useContext(UserContext);
    const [registerValue, setRegisterValue] = useState({id: "", pw: ""});
    const [errorMessage, setErrorMessage] = useState(""); 

    const handleValid = (e, type) => {
        const changeValue = e.target.value;
        setRegisterValue(preValue => ({...preValue, [type]: changeValue}));
    }
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(""); 

        if(!registerValue.id || !registerValue.pw){
            setErrorMessage('값을 입력해 주세요.')
            return;
        } 

        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                login_id: registerValue.id,
                password: registerValue.pw
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;

            if (data.message === '로그인 성공') {
                localStorage.setItem('user', JSON.stringify(data)); 
                setUser(data);
                navigate('/', {replace: true});
                alert('로그인 성공!');

                // 일정 시간 후 로컬 스토리지 데이터 삭제 (예: 1시간 = 3600000ms)
                setTimeout(() => {
                    localStorage.removeItem('user');
                    setUser(null)
                    alert('자동 로그아웃 되었습니다.');
                    navigate('/login', { replace: true });
                }, 3600000); // 1시간
            } 
        } catch (error) {
            console.error('서버 오류:', error);
            setErrorMessage(error.response ? error.response.data.message : '서버 오류');
        }
        
    };

    return(
        <div className="Login">
            <form method='post' onSubmit={handleLogin}>
                <h1>로그인</h1>
                <div>id <input type="id" onChange={(e)=>handleValid(e, 'id')} value={registerValue.id} name='login_id'/> </div>
                <div>password <input type="password" onChange={(e)=>handleValid(e, 'pw')} value={registerValue.pw} name='password'/> </div>
                <button type='submit'>로그인</button>
                <Link to={'/join'}>회원가입</Link>

                {errorMessage && <p className="error">{errorMessage}</p>} {/* 오류 메시지 표시 */}
            </form>
        </div>
    )
}

export default Login;