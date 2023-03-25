const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const pgroomies = require('../controllers/pgroomies');
const { isLoggedIn, isAuthor, validatePgroomies } = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer ({storage})


router.get('/',catchAsync(pgroomies.index));

router.get('/new', isLoggedIn, pgroomies.renderNewForm)

router.post('/', isLoggedIn, upload.array('image'),validatePgroomies ,catchAsync(pgroomies.createPgroomies))

router.get('/:id', catchAsync(pgroomies.showPgroomies));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(pgroomies.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validatePgroomies, catchAsync(pgroomies.updatePgroomies));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(pgroomies.deletePgroomies));

module.exports = router; 