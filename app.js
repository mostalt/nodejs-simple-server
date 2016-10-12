var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//data
var store = {
    home: {
        page: 'Our Super Awesome Home Page',
        content: 'Home, sweet home'
    },
    about: {
        page: 'About Page',
        content: 'Some incredibly awesome content'
    },
    downloads: {
        page: 'Downloads Page',
        content: 'Some incredibly awesome content'
    },
    profile: {
        page: 'Profile page',
        content: 'Some incredibly awesome content'
    },

}

var storeKeys = Object.keys(store);

app.disable('x-powered-by');
app.set('view engine', 'pug');

//Middleware
app.use(function(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});

//app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/about', function(req, res) {
    res.render('about', {
        links: storeKeys,
        query: req.query
    });
});

app.route('/new')
    .get(function(req, res) {
        res.render('new', {
            page: 'Add New Page',
            links: storeKeys,
            query: req.query
        })
    })
    .post(function(req, res) {
        var data = req.body;

        if ( data.pageurl && data.pagename && data.pagecontent ) {
            store[data.pageurl] = {
                page: data.pagename,
                content: data.pagecontent
            };
            storeKeys = Object.keys(store);
            res.redirect('/' + data.pageurl);
        } else {
            res.redirect('/');
        }
    });

app.get('/:page?', function(req, res) {

    var page = req.params.page;

    if (!page) page = 'home'

    var data = store[page];

    if (!data) return res.redirect('/');

    data.links = storeKeys;
    data.query = req.query; //request parameters
    res.render('app', data)
});


//Creat server
var server = app.listen(3000, function() {
    console.log('Listening on port 3000')
})