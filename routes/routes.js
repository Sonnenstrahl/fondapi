var request = require('request');
var cheerio = require('cheerio');

var appRouter = function (app) {
    app.get("/", function(req, res) {
        res.status(200).send("This is an API");
    });

    app.get('/isin/:id', function (req,res) {
        var id = req.params.id;
        var universe = 'CH-prof';
        if (id.substr(0,2).toLowerCase()==='us'){
            universe='UK-prof';
        }
        var options = {
            url: 'http://www.fundinfo.com/de/isin/' + id,
            headers: {
                'User-Agent' : 'request',
                'Cookie': 'DisclaimerAccepted=false; DisplayUniverse='+universe+';'
            }

        }
        request.get(options, function(err,resp,body){
            var $ = cheerio.load(body);
            if ($('title').text().includes('Keine Fonds gefunden')){
                res.status(404).json({error: 'invalid isin'});
            } else {
                var t =  $('.default-share-class > td.price > div').text();
                var i = t.split(' ');
                res.status(200).json({isin:id,value:Number(i[0]),currency:i[1]});
            }
        })

    });
}

module.exports = appRouter;