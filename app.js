var express = require('express');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');




var app = express();
var port = process.env.PORT || 3000;
app.use('/public',express.static(path.join(__dirname, 'public')));




app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, 'views/index.html'));
});


app.post('/upload', (req, res)=>{

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', (field, file)=>{
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', (err)=>{
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end',()=> {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

  res.status(200).send();
});


app.listen(port, function(){
  console.log('Server listening on port',port);
});