var bodyParser = require('body-parser');
var fs = require('fs');
var https = require('https');
var urls = [];
var txt = [];
var folderName;
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

module.exports = function(app) {

  app.get('/wiki', function(req, res) {
    res.render('index', {
      wikis: urls
    });
  });


  app.post('/wiki', /*urlencodedParser,*/ function(req, res) {});


  app.post('/wiki/urls', urlencodedParser, function(req, res) {
    urls.push(Object.keys(req.body)[0]);
    res.send(Object.keys(req.body)[0]);
    //console.log(urls.length);
    //console.log('URL:     ' + Object.keys(req.body)[0]);
    var ext = '.png';
    //request(Object.keys(req.body)[0]).pipe(fs.createWriteStream(folderName+'/'+urls.length+'.png')).on('close', console.log('done'));
    if (Object.keys(req.body)[0].slice(-4) === '.jpg') {
      ext = '.jpg';
    } else if (Object.keys(req.body)[0].slice(-4) === '.png') {
      ext = '.png';
    } else if (Object.keys(req.body)[0].slice(-4) === '.svg') {
      ext = '.svg';
    } else if (Object.keys(req.body)[0].slice(-4) === 'webm') {
      ext = '.webm';
    }
    //console.log('FolderNameL:     ' + folderName + '/' + urls.length + ext);
    //Node.js Function to save image from External URL.
    function saveImageToDisk(url, localPath) {
      var file = fs.createWriteStream(localPath);
      var request = https.get(url, function(response) {
        response.pipe(file);
      });
    }
    saveImageToDisk(Object.keys(req.body)[0], folderName + '/' + urls.length + ext);
  });

  app.post('/wiki/descriptions', urlencodedParser, function(req, res) {
    txt.push(Object.keys(req.body)[0]);
    res.send(Object.keys(req.body)[0]);
    //console.log(txt.length);
    //console.log('txt:     ' + Object.keys(req.body)[0]);
    var ext = '.txt';
    //console.log('FolderNameL:     ' + folderName + '/' + txt.length + ext);
    //Node.js Function to save .txt from External string.
    fs.writeFile(folderName + '/' + txt.length + ext, Object.keys(req.body)[0], function(err) {
      //if (err) console.log(err);
      //console.log(".txt file successfully saved");
    });
  });


  app.post('/wiki/main', urlencodedParser, function(req, res) {
    res.send(Object.values(req.body));
    console.log('main:     ' + Object.values(req.body));
    var ext = '.txt';
    //console.log('FolderNameL:     ' + folderName + '/' + txt.length + ext);
    //Node.js Function to save .txt from External string.
    fs.writeFile(folderName + '/' + 'main' + ext, Object.values(req.body), function(err) {
      if (err) console.log(err);
      console.log("main.txt file successfully saved");
    });
  });


  app.post('/wiki/:foldername', function(req, res) {
    //TODO: make the first part a variable that will be set eirlyer by finding the current directory
    folderName = 'C:/Users/flofl/Desktop/Coding Files/Atom files/Wiki Data Tool/data/' + req.params.foldername;
    console.log('test 4:' + folderName);
    try { // unless it is allready taken
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
        console.log('Folder created:' + folderName);
      }
    } catch (err) {
      console.log(err);
      //console.log('err');
    }
  });
};
