var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var urlencoded=bodyParser.urlencoded({extended:false});
mongoose.connect('mongodb://localhost/eshop');
var Schema=mongoose.Schema;
var Shopschema=new Schema({
name:String, 
address: String,
Mobile: String,
});
var Shop=mongoose.model('Shop',Shopschema);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.listen(8080);
console.log("App listening on port 8080");
app.get('/api/shops', function(req, res) {
    Shop.find({},function(err, shops) {
        if (err)
            res.send(err)

        res.json(shops); // return all shops in JSON format
    });
});
app.get('/api/shops/:id', function(req, res) {
    Shop.findById(req.params.id,function(err, shop) {
        if (err)
            res.send(err)

        res.json(shop); 
            });
});
app.post('/api/shops',urlencoded, function(req, res) {

   var s=new Shop({
	name:req.body.name,
	address:req.body.address,
	mobile: req.body.mobile

	});
	s.save(function(err){
		if(!err){
			console.log('Success:');
			res.send('created shop :' +s);
			res.json(s);

		}
	});

});
app.delete('/api/shops/:id', function(req, res) {
    Shop.remove({
        _id : req.params.id
    }, function(err) {
        if (err)
            res.send(err);
        else
        	res.send("Deleted Successfully");
      
    });
});
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});
