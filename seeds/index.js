require('dotenv').config();

const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const pgroomies = require("../models/pgroomies");
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/pgroomies';
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
  try {
    const response = await axios.get(
      "https://api.unsplash.com/photos/random?query=housing&client_id=UNSPLASH_ACCESS_KEY"
    );

    // Check if we got results
    // if (response.data.results && response.data.results.length > 0) {
    //   // Get the first result and return the regular image URL
    //   const image = response.data.results[0];
    //   return image.urls.regular;
    // } else {
    //   throw new Error('No images found');
    // }
    const imageUrl = response.data.urls.regular;
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error.message);
    throw error;
  }
}

// const randomIndex = Math.floor(Math.random() * cities.length);

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await pgroomies.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * cities.length);
    const selectedCity = cities[randomIndex];

    if (!selectedCity) {
      console.error(`City at index ${randomIndex} is undefined`);
      continue;
    }

    const price = Math.floor(Math.random() * 20) + 10;
    const pg = new pgroomies({
      author: '6711360d7361c495cf8c7b10',
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
