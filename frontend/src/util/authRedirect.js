import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const AuthRedirect = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const publicPaths = ['/join'];
        const path = window.location.pathname;
        // 로그인된 사용자가 로그인 페이지 또는 가입 페이지에 접근 시 홈으로 리다이렉트
        if (user && publicPaths.includes(path)) {
            alert ('잘못된 접근입니다.')
            navigate('/', { replace: true });
        }
    }, [user, navigate]);
    return null;
};

export default AuthRedirect;