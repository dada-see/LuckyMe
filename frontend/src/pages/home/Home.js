import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import WiseContext from "../../util/wiseList";
import { UserContext } from "../../App";

const Home = ({handleLogout}) => {
    const navigate = useNavigate();
    const [sideMenu, setsideMenu] = useState(false);
    const { wise } = useContext(WiseContext);
    const { user } = useContext(UserContext);

    const toggleSide = () => {
        setsideMenu(prev => !prev)
    };

    return(
        <div className="Home">
            홈이다
            <div>{user? user.nickname: ''}님, 안녕하세요</div>
            <div onClick={toggleSide}>사이드메뉴열기</div>
            {wise && wise ? ( 
                <div>
                    {wise.map((w)=>
                        <p key={w.id}>{w.speaker_ko}</p>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}

            
            <div className={sideMenu?"side open":"side"}>
                <p>사용자님</p>
                <div>
                    오늘의 Lucky
                </div>
                <p onClick={()=>navigate('/calendar')}>모든 Lucky들 보기</p>
                <p>내정보</p>
                <p className="logoutBtn" onClick={()=> handleLogout()}>로그아웃</p>
                <p>탈퇴하기</p>
                <div onClick={toggleSide}>닫기</div>
            </div>
        </div>
    )

}

export default Home;