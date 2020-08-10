const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');






// INDEX ROUTE - show all campgrounds

router.get('/', function(req, res){
   // get all campgrounds from DB
   Campground.find({}, (err, data) => {
       if(err){
           console.log(err)
       } else {
        res.render('campgrounds/index', {campgrounds:data, page: 'campgrounds'});
       }
   });
});



// CREATE ROUTE - add a new campground to DB

router.post('/', middleware.isLoggedIn, (req, res) => {


    // get data from form and add to campgrounds array
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, price: price, image: image, description: desc, author: author}
    
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newCampground){
        if(err){
            console.log(err);
        } else {
            // redirect back to campgrounds
            console.log(newCampground);
            res.redirect('/campgrounds');
        }
    })
    

    
});

// NEW ROUTE - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});



// SHOW ROUTE - shows more info about one campground
router.get('/:id', (req, res) => {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(

        function(err, foundCampground){
            if(err){
                console.log(err)
            } else {
                // render show template with taht campground
                res.render('campgrounds/show', {campground: foundCampground});
            }
        }

     ) 
    
});




// EDIT CAMPGROUND ROUTE

router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    // checking if user is logged in 
        Campground.findById(req.params.id, (err, foundCampground) => {
             
            res.render('campgrounds/edit', {campground: foundCampground});         
        });
});



// UPDATE CAMPGROUND ROUTE

router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            res.redirect('/campgrounds');
        } else {
            // redirect somewhere(show page)
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
    
})



// DESTROY CAMPGROUND ROUTE

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, removedCampground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            Comment.deleteMany({_id: { $in: removedCampground.comments } }, (err) => {
                if (err) {
                    console.log(err);
                }
            })
            res.redirect('/campgrounds');
        }
    })
})










module.exports = router;