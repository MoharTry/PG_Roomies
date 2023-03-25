const Pgroomies = require('../models/pgroomies');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const pg = await Pgroomies.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    pg.reviews.push(review);
    await review.save();
    await pg.save();
    req.flash('success','Successfully created new review');
    res.redirect(`/pgroomies/${pg.id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Pgroomies.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review');
    res.redirect(`/pgroomies/${id}`);
}