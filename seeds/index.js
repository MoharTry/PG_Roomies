require("dotenv").config();

const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const pgroomies = require("../models/pgroomies");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/pgroomies";
const axios = require("axios");

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("MONGO OH NO ERROR!!!!");
    console.log(err);
  });

async function getRandomImage() {
  const response = await axios.get(
    "https://api.unsplash.com/photos/random?query=camping&client_id=UNSPLASH_SECRET_KEY"
  );
  return response.data.urls.regular; // This will give the URL of the regular-sized image
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await pgroomies.deleteMany({});
  for (let i = 0; i < 5; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const pg = new pgroomies({
      author: "UNSPLASH_ID",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam sint nesciunt praesentium illum porro, magni dignissimos consectetur, tempora obcaecati illo eius doloribus voluptatem maxime numquam tenetur est velit libero quibusdam?",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: await getRandomImage(),
          filename: "pgroomies/ahfnenvca4tha00h2ubt",
        },
        {
          url: await getRandomImage(),
          filename: "pgroomies/ruyoaxgf72nzpi4y6cdi",
        },
      ],
    });
    await pg.save();
  }
  console.log("Database Connected");
};

seedDB().then(() => {
  mongoose.connection.close();
});
