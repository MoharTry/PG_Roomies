const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const pgroomies = require('../models/pgroomies');
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/pgroomies";

mongoose.connect(dbUrl)
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("MONGO OH NO ERROR!!!!")
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await pgroomies.deleteMany({});
    for (let i = 0; i < 1090; i++) {
        const random1093 = Math.floor(Math.random() * 1093);
        const price = Math.floor(Math.random() * 999) + 10;
        const pg = new pgroomies({
            author: '63d670bdef7b2f501cbebdc7',
            location: `${cities[random1093].city}, ${cities[random1093].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam sint nesciunt praesentium illum porro, magni dignissimos consectetur, tempora obcaecati illo eius doloribus voluptatem maxime numquam tenetur est velit libero quibusdam?',
            price,
            geometry: {
                type:"Point",
                coordinates:[
                    cities[random1093].longitude,
                    cities[random1093].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dllgmqo7k/image/upload/v1675595971/PG_Roomies/hvyugzudud0jz6c8q7hz.jpg',
                    filename: 'PG_Roomies/hvyugzudud0jz6c8q7hz',
                },
                {
                    url: 'https://res.cloudinary.com/dllgmqo7k/image/upload/v1675595971/PG_Roomies/xfrphmk8usu2m2gkguyp.webp',
                    filename: 'PG_Roomies/xfrphmk8usu2m2gkguyp',
                },
                {
                    url: 'https://res.cloudinary.com/dllgmqo7k/image/upload/v1675595971/PG_Roomies/d7v1sp6dw1cwd4989qvv.jpg',
                    filename: 'PG_Roomies/d7v1sp6dw1cwd4989qvv',
                }
            ]
        })
        await pg.save();
    }
    console.log("Database Connected")
}
seedDB().then(() => {
    mongoose.connection.close();
})