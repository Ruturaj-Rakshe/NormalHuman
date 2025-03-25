import {db} from './server/db';

await db.user.create({
    data: {
        emailAddress: 'rutu.bahrain@gmail.com',
        firstName: 'Test',
        lastName: 'User',

    }
})