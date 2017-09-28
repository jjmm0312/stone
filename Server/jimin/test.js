exports.get = function(req, res){
	console.log(req.param("id"));
	res.render('test');
};

exports.post = function(req, res){
	console.log(req.body);
	res.render('test');
};
