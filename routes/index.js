var express = require('express');
var router = express.Router();

/* GET home page. */
app.get('/', function(req, res) {
			res.render('index.jade', { 
            locals: {
                title: 'Application de Gestion',
            }
        });
});

module.exports = router;
