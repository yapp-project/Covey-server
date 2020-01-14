import { Career, CareerDocument } from '../models/Career';
import { MONGODB_URI } from '../config/secret';

import mongoose from 'mongoose';


const careers: CareerDocument[] = [];
const periodUnit: string[] = ['주', '개월', '년'];
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 3; j++) {
        careers.push(new Career({
            userId: `5e1d2302a690f093ecab0ea${i}`,
            name: `yapp 카페${j+1}`,
            job: '바리스타',
            periodNum: `${j+1}`,
            periodUnit: periodUnit[j]
        }));
    }
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
careers.map(async (p, index) => {
    await p.save((err) => {
        if (err) console.log(err);
        
        if (index === careers.length - 1) {
        console.log('DONE!');
        mongoose.disconnect();
        }
    });
});