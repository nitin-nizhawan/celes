
function Star(name,dec,rad){
  this.name = name;
  this.dec = dec;
  this.rad = rad; 
}
var stars =[
new Star("Sun",dms(3,35),hms(11,26)),
new Star("Sirius",dms(-16,42,58),hms(6,45,8.9)),
new Star("Canopus",dms(-52,41,44),hms(6,23,57.1)),
new Star("Alpha Centauri",dms(-60,50,2),hms(14,39,36.4)),
new Star("Arcturus",dms(19,10,56),hms(14,15,39.7)),
new Star("Vega",dms(38,47,1.28),hms(18,36,56.33)),
new Star("Capella",dms(45,59,52),hms(5,16,41)),
new Star("Rigel",dms(-8,12,5.9),hms(5,14,32.2)),
new Star("Procyon",dms(5,13,29.9),hms(7,39,18.11)),
new Star("Achernar",dms(-57,14,12.3),hms(1,37,42.8)),
new Star("Betelgeuse",dms(7,24,25.4),hms(5,55,10.3)),
new Star("Beta Centauri (Hadar)",dms(-60,22,22.9),hms(14,3,49.4)),
new Star("Altair",dms(8,52,5.9),hms(19,50,46.9)),
new Star("ACrux",dms(-63,5,56),hms(12,26,35.8)),
new Star("Aldebaran",dms(16,30,33.4),hms(4,35,55.2)),
new Star("Antares",dms(-26,25,55),hms(16,29,24.4)),
new Star("Spica",dms(-11,9,40.7),hms(13,25,11.5)),
new Star("Pollux",dms(28,1,34),hms(7,45,19)),
new Star("Fomalhaut",dms(-29,37,20),hms(22,57,39.0)),
new Star("Deneb",dms(45,16,49),hms(20,41,25)),
new Star("Mimosa",dms(-59,41,19),hms(12,47,43)),
new Star("Regulus",dms(11,59,48),hms(10,8,12.8)),

new Star("Eelnath",dms(28,36),hms(5,26)),
// pole star
new Star("pole star",dms(89,59),hms(2,16)),
 // castor
new Star("castor",dms(31,53),hms(7,34)),
// pollx
// sun
 
];


var circleRadius = 400;
var circleX = circleRadius;
var circleY = circleRadius;
var ctx = null;
function toDeg(hour,minute,seconds){
    var deg = hour*15;
    deg+= minute*15/60;
    deg+=seconds*15/(3600);
    return deg;
}
function getZenithRa(longitude){
    // equinox = march, 20 , 16:15
    var eHour = 16;
    var eMin = 15;
    var epocSecondsOnEquinox = new Date(2018,2,20,eHour,eMin,0).getTime() - new Date().getTimezoneOffset()*60*1000;
    var milliSecondsElapsed = new Date().getTime() - epocSecondsOnEquinox;
    //degreesPerMilis/ 361 degrees in one 24hours=> 361 degrees in 24*60*60*1000 millis
     var degreesPerMillis = 361/(24*60*60*1000);
     var degreesElapsed = milliSecondsElapsed * degreesPerMillis;
      // on equinox zero hour angle is no zenith at 12PM (not 12AM) therefore offset by 12
     var raAtZenithAtGreenwitch = ((eHour+eMin/60+12)%24)*15 + degreesElapsed; // right now
     var raAtCurrentLocation = raAtZenithAtGreenwitch + longitude;
    return raAtCurrentLocation;

}
function sin(deg){
   return Math.sin(deg*Math.PI/180);
}
function cos(deg){
   return Math.cos(deg*Math.PI/180);
}

function draw3DPoint(point,star){
   var a = point[0];
   var b = point[1];
   ctx.beginPath();
    ctx.fillStyle = ctx.strokeStyle="white";
    ctx.arc(a,b,3,0,2*3.14); 
   ctx.fill();  
   ctx.stroke();
ctx.font = "14px Arial";
ctx.fillText(star.name,a+ctx.measureText("M").width,b); 
}


function drawPositiveZ(point,star){
   if(point[2] >=0){
      draw3DPoint(point,star);
   }
}









function decRaTo3D(dec,ra){
   var x = -cos(dec)*sin(ra);
   var y = sin(dec);
   var z = cos(ra)*cos(dec); 
   return [x,y,z];
}

function scale(point,s){
   return [point[0]*s,point[1]*s,point[2]*s];
}

function translateCenter(point){
    return [point[0]+circleRadius,point[1]+circleRadius,point[2]];
}
function dot(a,b){
  return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
}
function rotateY(point,angle){
    point = [point[0]-circleRadius,point[1]-circleRadius,point[2]];
   
   var rx = [[cos(angle),0,sin(angle)],[0,1,0],[ -sin(angle), 0,cos(angle)]];
   point = [dot(rx[0],point),dot(rx[1],point),dot(rx[2],point)];
   return translateCenter(point);
}

function rotateX(point,angle){
    point = [point[0]-circleRadius,point[1]-circleRadius,point[2]];
   
   var rx = [[1,0,0],[0,cos(angle),-sin(angle)],[0 , sin(angle), cos(angle)]];
   point = [dot(rx[0],point),dot(rx[1],point),dot(rx[2],point)];
   return translateCenter(point);
}
function dms(d,m,s){
    s = s||0;
   return d+m/60+s/3600;
}
function hms(h,m,s){
   s= s || 0;
  return (h+m/60+s/3600)*15;
}
var counter=0.00;
function init(c /*canvas*/,latitude,longitude){
 counter-=0.00;
  var c //= document.getElementById("mycanvas");
   ctx = c.getContext("2d");
if(c.height!=circleRadius*2){
   c.width = c.height = circleRadius*2;
}
//   ctx.clearRect(0,0,c.width,c.height);
//  var data = imageData.data;
 ctx.beginPath();
   ctx.arc(circleRadius,circleRadius,circleRadius,0,2*3.14);
ctx.fillStyle="black";
ctx.strokeStyle="black";
ctx.fill();
  ctx.stroke();
  var polStar ={
     dec:90,
     ra:toDeg(2,30,0)
  }

function drawStar(star){
   var point = decRaTo3D(-star.dec,-star.rad);
   point = scale(point,circleRadius);
   point = translateCenter(point);
   point = rotateY(point,counter-getZenithRa(longitude));
   point = rotateX(point,-latitude);
   drawPositiveZ(point,star);
}
//test(28+36/60,5*15+15*26/60)
for(var i=0;i<stars.length;i++){
   drawStar(stars[i]);
}
/*drawStar(dms(28,36),hms(5,26))
drawStar(dms(45,59),hms(5,16))
// pole star
drawStar(dms(89,59),hms(2,16))
 // castor
drawStar(dms(31,53),hms(7,34))
// pollx
drawStar(dms(28,1),hms(7,45))
// sun
drawStar(dms(3,35),hms(11,26))*/
window.setTimeout(function(){
     init(c,latitude,longitude);
},500);

}
