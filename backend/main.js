const express = require('express');
const app = express();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const pool = require('./src/utils/mariadb');
const authRouter = require('./src/routes/auth');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
require('dotenv').config({ path: '.env.session' });

app.use(helmet());
app.use(compression());
app.use(cors({
    origin: 'http://localhost:3001', //추후에 특정 url을 적어두어도 된다.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    store: new FileStore(),
    cookie: {
        maxAge: 60 * 60 * 1000,
        httpOnly: false,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production' // 프로덕션 환경에서는 HTTPS만 사용
    }
}))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`SELECT * FROM wise`);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error occurred:', err); // 오류 로그 출력
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
})

app.use('/auth', authRouter);

app.use((req, res, next)=>{
    res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000);