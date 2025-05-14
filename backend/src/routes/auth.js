const express = require('express');
const session = require('express-session');
const router = express.Router();
const pool = require('../utils/mariadb');
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const sanitizeInput = require('../utils/sanitizeConfig');

//회원가입
router.post('/create', async (req, res) => {
    try {
        // 모든 태그입력 방지하는 sanitize
        const login_id = sanitizeInput(req.body.login_id);
        const password = sanitizeInput(req.body.password);
        const nickname = sanitizeInput(req.body.nickname);

        //비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //db
        conn = await pool.getConnection();
        const query = `INSERT INTO users (login_id, password, nickname) VALUES (?, ?, ?)`;
        const result = await conn.query(query, [login_id, hashedPassword, nickname]);
        
        res.status(201).send('회원가입성공');
    } catch (err) {
        console.error('Error occurred:', err); 
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
});

//아이디 중복확인
router.get('/duplId', async (req, res) => {
    let conn;
    try {
        // 모든 태그입력 방지하는 sanitize
        const login_id = sanitizeInput(req.query.login_id);

        conn = await pool.getConnection();
        const query = `SELECT login_id FROM users WHERE login_id = ?`;
        const rows = await conn.query(query, [login_id]);

        if (rows.length > 0) {
            res.status(200).send('중복');
        } else {
            res.status(200).send('사용 가능한 ID입니다.');
        }
    } catch (err) {
        console.error('Error occurred:', err); 
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
});

router.post('/getSession',async (req, res) => {
    try{
        const id = session.getAttribute(req).toString();
        if(id === req){
            res.status(200).send('세션 유지');
        }
    } catch (err) {
        console.error('Error occurred:', err); 
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
});

router.post('/login', async (req, res) => {
    let conn;
    try {
        // 사용자 입력 sanitize
        const login_id = sanitizeInput(req.body.login_id);
        const password = sanitizeInput(req.body.password);
        
        // 데이터베이스 연결
        conn = await pool.getConnection();

        // 사용자 정보 조회
        const query = `SELECT * FROM users WHERE login_id = ?`;
        const row = await conn.query(query, [login_id]);

        if(row.length === 0){
            return res.status(401).json({message: '회원정보가 없습니다.'});
        }
        const user = row[0];
        const match = await bcrypt.compare(password, user.password);
        if(match){
            const sessionId = Math.random().toString(36).slice(2);
            // 로그인 성공 시 세션에 사용자 정보 저장
            req.session.is_logined = true;
            req.session.key = sessionId
            req.session.userId = user.id;
            req.session.nickname = user.nickname;
            req.session.save(() => {
                res.status(200).json({
                    message: '로그인 성공',
                    key: sessionId,
                    nickname: user.nickname
                });
            });
        } else {
            res.status(401).json({
                message: '맞지 않는 비밀번호입니다.'
            });
        }
    } catch (err) {
        res.status(500);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
});

router.post('/logout', (req, res) => {
    const sessionKey = req.body.userKey;
    try{
        if(sessionKey){
            sessionKey.destroy(()=>{
                res.status(200).json('세션 삭제 완료')
            })
        }
    } catch {
        console.error('Error occurred:', err); 
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
});

module.exports = router;