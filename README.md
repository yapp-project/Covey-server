# Covey-server
YAPP 15기 대학내일팀 / 알바 대타 매칭  

## 프로젝트 설치 및 시작
```
$ sudo apt-get install curl
$ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
$ sudo apt-get install nodejs
$ sudo apt-get install letsencrypt
$ git clone https://github.com/yapp-project/Covey-server.git
$ cd ./Covey-server
$ vi .env
$ npm i
$ mkdir public
$ cd ./public
$ mkdir -p .well-known/acme-challenge
$ certbot certonly --webroot -w ~/Covey-server/public -d covey.kr
$ cd ..
$ nohup npm start &

// 이후 서버 수정 해야할 때
$ netstat -nlp
$ sudo kill -9 [pid]
~~수정작업~~
$ nohup npm start &

// log기록은 ~/Covey-server/nohup.out 파일
```

## 기술스택
- NodeJS
- ExpressJS
- TypeScript
- MongoDB

## swagger 문서
- https://covey.kr/api-docs/

