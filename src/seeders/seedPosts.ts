import { Post, PostDocument } from '../models/Post';
import { MONGODB_URI } from '../config/secret';

import mongoose from 'mongoose';

const posts: PostDocument[] = [];

for (let i = 0; i < 5; i++) {
    posts.push(new Post({
        userId: '5e1d2302a690f093ecab0ea5',
        title: `대학내일 PC방${i+1}`,
        startDate: '2020-02-01',
        endDate: '2020-02-28',
        dueDate: '2020-02-01',
        workingTime: '10:00 ~ 19:00',
        address1: '서울특별시',
        address2: '중랑구',
        address3: '동일로 164길',
        pay: 8500 + 500*i,
        description: '개꿀 알바',
        category: 'PC방',
    }));
}
for (let i = 0; i < 5; i++) {
    posts.push(new Post({
        userId: '5e1d2302a690f093ecab0ea1',
        title: `대학내일 분식점${i+1}`,
        startDate: '2020-03-01',
        endDate: '2020-03-31',
        dueDate: '2020-02-28',
        workingTime: '10:00 ~ 19:00',
        address1: '서울특별시',
        address2: '중랑구',
        address3: '동일로 164길',
        pay: 8500 + 500*i,
        description: '개꿀 알바',
        category: '식당',
    }));
}
for (let i = 0; i < 5; i++) {
    posts.push(new Post({
        userId: '5e1d2302a690f093ecab0ea2',
        title: `대학내일 포차${i+1}`,
        startDate: '2020-04-01',
        endDate: '2020-04-30',
        dueDate: '2020-03-31',
        workingTime: '10:00 ~ 19:00',
        address1: '서울특별시',
        address2: '중랑구',
        address3: '동일로 164길',
        pay: 8500 + 500*i,
        description: '개꿀 알바',
        category: '술집',
    }));
}


//connect mongoose
mongoose
    .connect(MONGODB_URI, { 
        dbName: 'covey',  
        useNewUrlParser: true 
        })
    .catch(err => {
        console.log(err.stack);
        process.exit(1);
    })
    .then(() => {
        console.log('connected to db in development environment');
    });
    
//save your data. this is an async operation
//after you make sure you seeded all the products, disconnect automatically
posts.map(async (p, index) => {
    await p.save((err) => {
        if (err) console.log(err);
        
        if (index === posts.length - 1) {
        console.log('DONE!');
        mongoose.disconnect();
        }
    });
});