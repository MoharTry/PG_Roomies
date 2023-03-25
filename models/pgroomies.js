const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
    url: String,
    filename: String,
});

ImageSchema.virtual('thumbnail').get(function  () {
    return this.url.replace('/upload','/upload/w-200');
});

const opts = { toJSON: { virtuals: true}};

const PgroomiesSchema = new Schema({
    title: String,
    images:[ImageSchema],
    geometry: {
        type:{ 
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates: {
            type:[Number],
            required:true
        },
    },
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
}, opts);

PgroomiesSchema.virtual('properties.popUpMarkup').get(function  () {
    return `
    <strong><a style="text-decoration:none" href="pgroomies/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,20)}....<p>`
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