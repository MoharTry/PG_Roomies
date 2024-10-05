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
    "https://api.unsplash.com/search/photos?query=camping&client_id=UNSPLASH_ACCESS_KEY"
  );
  return response.data.urls.regular; //  URL of the regular-sized image
}

// const randomIndex = Math.floor(Math.random() * cities.length);

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await pgroomies.deleteMany({});
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * cities.length);
    const selectedCity = cities[randomIndex];

    if (!selectedCity) {
      console.error(`City at index ${randomIndex} is undefined`);
      continue;
    }

    const price = Math.floor(Math.random() * 20) + 10;
    const pg = new pgroomies({
      author: "UNSPLASH_ID",
      location: `${selectedCity.city}, ${selectedCity.state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam sint nesciunt praesentium illum porro, magni dignissimos consectetur, tempora obcaecati illo eius doloribus voluptatem maxime numquam tenetur est velit libero quibusdam?",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          selectedCity.longitude,
          selectedCity.latitude,
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
  console.log("Database seeded successfully!");
};

seedDB().then(() => {
  mongoose.connection.close();
})
