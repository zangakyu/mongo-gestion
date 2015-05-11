var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var provider = req.provider;

	provider.findAll( function(error,cbs){
	res.render('collaborateurs.jade', { 
	    locals: {
	        title: 'Collaborateurs',
	        listeCollaborateurs:cbs
	    }
	});
	});
});


router.get('/new', function(req, res) {
    res.render('collaborateurs_new.jade', { locals: {
        title: 'New Collaborateur'
    }
    });
});

router.post('/new', function(req, res){
    provider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/');
    });
});

router.param('id', function(req, res, next, did) {
	var regex = /[a-zA-Z0-9]{24}/;
	var captures;
	if(captures = regex.exec(id)) {
		req.params.id = id;
		next();
	} else {
		next('/');
	}
});

router.get('/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('blog_show.jade',
        { locals: {
            title: article.title,
            article:article
        }
        });
    });
});

module.exports = router;
