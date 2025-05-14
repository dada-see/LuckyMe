import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Join =()=>{
    const navigate = useNavigate();
    const [registerValue, setRegisterValue] = useState({id: "", pw: "", nickname: ""});
    //유효성 통과 유무
    const [valid, setValid] = useState({id:false, pw:false, nickname:false});
    //아이디 중복확인
    const [duplId, setDuplId] = useState(false)
    //정규식
    const regex = {
        id: /^[a-zA-Z0-9]{5,20}$/i,
        pw: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/,
        nickname: /^[a-zA-Z0-9가-힣_.-]{1,20}$/
    };

    //회원가입
    const register = async (e) => {
        e.preventDefault(); 
        if (valid.id && valid.pw && valid.nickname && duplId) {
            try {
                const response = await axios.post(
                    "http://localhost:3000/auth/create", 
                    {
                        login_id: registerValue.id,
                        password: registerValue.pw,
                        nickname: registerValue.nickname
                    }
                );

                if(response.data === '회원가입성공'){
                    alert('회원가입 성공');
                    navigate('/login');
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("유효성 검사를 통과하지 못했습니다.");
        }
    };

    //정규식 승인 -> boolean 값 변경
    const handleValid = (e, type) => {
        const changeValue = e.target.value;
        let isValid = regex[type].test(changeValue);
        setValid(preValid => ({...preValid, [type]: isValid}));
        setRegisterValue(preValue => ({...preValue, [type]: changeValue}));
    };

    const duplCheckId = async (e) => {
        e.preventDefault(); 
        if (valid.id) {
            try {
                const response = await axios.get(
                    `http://localhost:3000/auth/duplId?login_id=${encodeURIComponent(registerValue.id)}`
                );
                if(response.data === '중복'){
                    setDuplId(false);
                    alert('이미 존재하는 아이디입니다.');
                } else {
                    setDuplId(true)
                    alert('가입 가능한 아이디입니다.')
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("아이디의 조건에 맞게 올바르게 입력해주세요.");
        }
    }
    
    return(
        <div className="Join">
            <form onSubmit={register}>
                <h1>회원가입</h1>
                <div>id <input type="id" onChange={(e)=>handleValid(e, 'id')} value={registerValue.id} name='login_id'/> {valid.id? '가능한 아이디' : '사용불가 아이디'} <button onClick={duplCheckId}>중복확인</button> </div>
                <div>password <input type="password" onChange={(e)=>handleValid(e, 'pw')} value={registerValue.pw} name='password'/> {valid.pw? '가능한 비번' : '사용불가 비번'}</div>
                <div>nickname <input type="text"  onChange={(e)=>handleValid(e, 'nickname')} value={registerValue.nickname} name='nickname'/> {valid.nickname? '가능한 이름': '사용불가 이름'} </div>
                <input type='submit' value='회원가입' />
            </form>
        </div>
    )
}

export default Join;