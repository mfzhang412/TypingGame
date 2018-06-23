var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var bodyParser = require('body-parser');

//use body parser to read POST
app.use(bodyParser.urlencoded({extended: false}));


http.listen(3000, function(){
    
  console.log('listening on *:3000');
});

///////////////////////////////////////////////////////////////////
//////////////////////////Image handler//////////////////////////////////
app.get('/hand1.png', function(req, res){    
    res.sendFile(__dirname + '/hand1.png');
});
app.get('/hand2.gif', function(req, res){     
    res.sendFile(__dirname + '/hand2.gif');
});
/////////////////////////////////////////////////////////////////
//////////////////Roots///////////////////////////////////////////
app.get('/', function(req, res){     
  console.log("root");
    res.sendFile(__dirname + '/root.html');
});
///////////////////////////////////////////////////////////////
///////////////////CSS handler///////////////////////////////////
app.get('/game.css', function(req, res){     
 
    res.sendFile(__dirname + '/game.css');
});
app.get('/video.mp4', function(req, res){     
 
    res.sendFile(__dirname + '/video.mp4');
});
app.get('/music.mp3', function(req, res){     
 
    res.sendFile(__dirname + '/music.mp3');
});
////////////////////////////////////////////////////////////////
////////////////////leaderboard/////////////////////////////
app.get('/leaderBoard', function(req, res){    
 
    res.sendFile(__dirname + '/leaderBoard.html');
});
app.get('/userNameDataBase.json', function(req, res){    
 
    res.sendFile(__dirname + '/userNameDataBase.json');
});
/////////////////////////////////////////////////////////////
//////////////////////////////UserName//////////////////////
app.post('/start', function(req, res){   
    var currentUserFlag = true;
    var rawJSON = fs.readFileSync("userNameDataBase.json");
    var parsedJSON = JSON.parse(rawJSON);
    for(var entry in parsedJSON.userNameData) {                 
        if(entry == req.body.user) {    
            currentUserFlag = false;
        }
    }
    if(currentUserFlag) {
    parsedJSON.userNameData[req.body.user] = {"score": 0, "timeStart": "default", "sentence": "default"};
    }
    fs.writeFileSync('userNameDataBase.json', JSON.stringify(parsedJSON, null, '\t'));
   
    
    res.sendFile(__dirname + '/start.html');
});
app.get('/start', function(req, res){   

    res.sendFile(__dirname + '/start.html');
});

////////////////////////////////////////////////////////////
////////////////////Gameplay///////////////////////////////
app.get('/gamePlay', function(req, res){    

    res.sendFile(__dirname + '/gamePlay.html');
});
app.post('/gamePlay', function(req, res){    
    //Only for time recording//////////////////////////////////////////////
    var rawJSON = fs.readFileSync("userNameDataBase.json");
    var parsedJSON = JSON.parse(rawJSON);
    var timeStart = new Date();
    var time = timeStart.getHours() * 3600 + timeStart.getMinutes() * 60 + timeStart.getSeconds();
    console.log(req.body);    
    parsedJSON.userNameData[req.body.user].timeStart = time;
   
    fs.writeFileSync('userNameDataBase.json', JSON.stringify(parsedJSON, null, '\t'));
    res.sendFile(__dirname + '/gamePlay.html');
});
app.get('/sentence.json/:name', function(req, res){ 
    console.log(req.params.name);
    var text = fs.readFileSync("BillOfRights.txt", "utf-8"); 
    var lines = text.split('\n');
    var index = Math.floor(Math.random() * (lines.length - 1));
    var rawJSON = fs.readFileSync("sentence.json");
    var parsedJSON = JSON.parse(rawJSON); 
    parsedJSON.sentence = lines[index];
    fs.writeFileSync('sentence.json', JSON.stringify(parsedJSON, null, '\t'));
    
    var rawJSON2 = fs.readFileSync("userNameDataBase.json");
    var parsedJSON2 = JSON.parse(rawJSON2);
    parsedJSON2.userNameData[req.params.name].sentence = lines[index];
    fs.writeFileSync('userNameDataBase.json', JSON.stringify(parsedJSON2, null, '\t'));

    res.sendFile(__dirname + '/sentence.json');
});
///////////////////Game Complete////////////////////////////////////
app.post('/gameComplete', function(req, res){    
    var timeEnd = new Date();
    var rawJSON = fs.readFileSync("userNameDataBase.json"); 
    var parsedJSON = JSON.parse(rawJSON);
    var timeStart = parsedJSON.userNameData[req.body.user].timeStart;
    var time = timeEnd.getHours() * 3600 + timeEnd.getMinutes() * 60 + timeEnd.getSeconds() - timeStart;
    var actual = parsedJSON.userNameData[req.body.user].sentence;
    var received = req.body.sentence;
    var correctCounter = 0;
    //score calculation
    for (var g = 0; g < actual.length && g < received.length; g++) {
       if(actual.charAt(g) == received.charAt(g)) {
           correctCounter++;
       } 
    }
    console.log("correct" + correctCounter);
    console.log("time" + time);
    var score = correctCounter * 100 / time;
    
    parsedJSON.userNameData[req.body.user].score += Math.floor(score);
    fs.writeFileSync('userNameDataBase.json', JSON.stringify(parsedJSON, null, '\t'));
    ///////////////////////////////////////
    res.sendFile(__dirname + '/gameComplete.html');
});

app.get('/gameComplete', function(req, res){ 

    res.sendFile(__dirname + '/gameComplete.html');
});

/////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
