import 'dotenv/config';

import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import errorHandler from 'errorhandler';
import express, { Application } from 'express';
import flash from 'express-flash';
import helmet from 'helmet';
import hpp from 'hpp';
import mongo, { MongoStoreFactory } from 'connect-mongo';
import mongoose, { Error } from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import https from 'https';
import path from 'path';

import { NODE_ENV, MONGODB_URI, SESSION_SECRET, PORT } from './config/secret';
import { passportConfig } from './passport';
import { lex } from './config/certificate';
import { swaggerOptions } from './config/swagger';
import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import postRouter from './routes/postRouter';
import careerRouter from './routes/careerRouter';
import applyRouter from './routes/applyRouter';

class Server {
    // Express App 필드 선언
    private app: Application;

    // 생성자
    constructor() {
        this.app = express();
        this.connectDB();
        passportConfig(passport);
        this.config();
        this.routes();
    }

    // DB 연결
    private connectDB(): void {
        const connect = async () => {
            await mongoose.connect(MONGODB_URI, {
                dbName : 'covey',
                useFindAndModify: false,
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            }, (error: Error) => {
                if (error) { console.error('몽고디비 연결 에러', error); }
                else { console.log('몽고디비 연결 성공'); }
            });
        };
        connect();
        mongoose.connection.on('error', (error: Error) => {
            console.log('몽고디비 연결 에러', error);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
            connect();
        });
    }

    // 기본 서버 설정 및 미들웨어 
    private config(): void {
        // Settings
        const MongoStore: MongoStoreFactory = mongo(session);
        const sessionOptions = {
            resave: false,
            saveUninitialized: false,
            secret: SESSION_SECRET,
            store: new MongoStore({ mongooseConnection: mongoose.connection }),
            cookie: {
                httpOnly: true,
                secure: false,
              },
            proxy: false
        };

        // middlewares
        if(NODE_ENV === 'production') {
            sessionOptions.proxy = true;
            sessionOptions.cookie.secure = true;
            sessionOptions.cookie.httpOnly = false;
            this.app.use(morgan('combined'));
            this.app.use(helmet());
            this.app.use(hpp());
            this.app.use(compression());
            this.app.use(cors());
        } else {
            this.app.use(morgan('dev'));
        }
        this.app.use('/img', express.static(path.join(__dirname, 'uploads')));
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cookieParser(SESSION_SECRET));
        this.app.use(session(sessionOptions));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(flash());
    }

    // 라우터
    private routes(): void {
        this.app.use('/api/auth', authRouter);
        this.app.use('/api/user', userRouter);
        this.app.use('/api/post', postRouter);
        this.app.use('/api/career', careerRouter);
        this.app.use('/api/apply', applyRouter);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));
    }

    // 서버 구동
    public start(): void {
        this.app.use(errorHandler());
        if(NODE_ENV === 'production') {
            https.createServer(lex.httpsOptions, lex.middleware(this.app)).listen(PORT, () => {
                console.log(`  App is running at http://localhost:${PORT}`);
                console.log('  Press CTRL-C to stop\n');
              });
        } else {
            this.app.listen(PORT, () => {
                console.log(`  App is running at http://localhost:${PORT}`);
                console.log('  Press CTRL-C to stop\n');
            });
        }
    }
}

const server: Server = new Server();
server.start();
