var http = require("http");
url = require('url');
var exec = require('child_process').exec;
var devices = exec("aplay -L | grep \"^[^ ]\"");

devices.stdout.on('data', function(data) {
  createAndDisplayServer(data.split("\n"))
});


function createAndDisplayServer(playDevices){
  var server = http.createServer(function(request, response) {
    if (request.method.toLowerCase() == 'get') {
        console.log("get");
        var url_parts = url.parse(request.url,true);
        console.log(url_parts.query);
        var selectedDevice = 0;
        if(url_parts.query != ""){
          selectedDevice = parseInt(url_parts.query["dev"]);
          exec("aplay -D " + playDevices[selectedDevice] + " feelgood.wav");
        }

        displayForm(response, playDevices, selectedDevice);
  } 
  });

  server.listen(3000);
  console.log("Server is listening");

}

function displayForm(response, playDevices, selectedDevice){
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<html>");
  response.write("<head>");
  response.write("<title>Play Sound</title>");
  response.write("</head>");
  response.write("<body>");
  response.write("Select the audio device");
  response.write("<form action=\"\" method=\"get\"><select name=\"dev\">");
  for (var i = 0; i < playDevices.length; i++) {
    if(selectedDevice && selectedDevice == i){
      response.write("<option value=\"" + i + "\" selected>" + playDevices[i]+"</option>");
    }else{
      response.write("<option value=\"" + i + "\">" + playDevices[i]+"</option>");
  }
    //Do something
}
  response.write("</select>");
  response.write(" <input type=\"submit\" value=\"Play\" /></form>");
  response.write("</body>");
  response.write("</html>");
  response.end();
}
