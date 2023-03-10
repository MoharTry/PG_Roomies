const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const PgroomiesSchema = new Schema({
    title: String,
    image: String,
    price: String,
    description: String,
    location: String,
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    reviews: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'Review' 
        }
    ]
});


PgroomiesSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Pgroomies', PgroomiesSchema);