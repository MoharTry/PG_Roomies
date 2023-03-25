const Pgroomies = require('../models/pgroomies');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const{clouidnary} = require("../cloudinary");
const pgroomies = require('../models/pgroomies');

module.exports.index = async (req, res) => {
    const pgroomies = await Pgroomies.find({});
    res.render('pgroomies/index', { pgroomies })
}

module.exports.renderNewForm = (req, res) => {
    res.render('pgroomies/new');
}

module.exports.createPgroomies = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query:req.body.pgroomies.location,
        limit:1,
    }).send()
    const pgroomies = new Pgroomies(req.body.pgroomies);
    pgroomies.geometry = geoData.body.features[0].geometry;
    pgroomies.images= req.files.map(f => ({url:f.path, filename:f.filename}));
    pgroomies.author = req.user.id;
    await pgroomies.save();
    console.log(pgroomies.images);
    req.flash('success', 'Successfully created a new PG room site !');
    res.redirect(`/pgroomies/${pgroomies.id}`)
}

module.exports.showPgroomies = async (req, res) => {
    const pgroomies = await Pgroomies.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(pgroomies);
    if (!pgroomies) {
        req.flash('error', 'Cannot find any such PG Room')
        return res.redirect('/pgroomies');
    }
    res.render('pgroomies/show', { pgroomies });
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const pg = await Pgroomies.findById(req.params.id)
    if (!pg) {
        req.flash('error', 'Cannot find any such PG Room')
        return res.redirect('/pgroomies');
    }
    res.render('pgroomies/edit', { pg });
}

module.exports.updatePgroomies = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const pgroomies = await Pgroomies.findByIdAndUpdate(id, { ...req.body.pgroomiesEdit });
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
    pgroomies.images.push(...imgs);
    await pgroomies.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await clouidnary.uploader.destroy(filename);
        }
        await pgroomies.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        console.log(pgroomies)
    }
    req.flash('success', 'Successfully updated PG Room');
    res.redirect(`/pgroomies/${pgroomies.id}`)
}

module.exports.deletePgroomies = async (req, res) => {
    const { id } = req.params;
    await Pgroomies.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted PG Room');
    res.redirect('/pgroomies');
}