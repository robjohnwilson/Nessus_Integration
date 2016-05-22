var restMessage = new sn_ws.RESTMessageV2();
restMessage.setHttpMethod("post");
restMessage.setEndpoint("https://localhost:8834/session");
restMessage.setStringParameter("password", "w1se4fun");
restMessage.setStringParameter("username", "rob.wilson");
var response = restMessage.execute();
var responseBody = response.getBody();
var parser = new JSONParser();
var parsed = parser.parse(responseBody);
token = parsed.token;

endpoint = "https://localhost:8834/scans/" + current.id + "/launch";

var restMessage = new sn_ws.RESTMessageV2();
restMessage.setRequestHeader('X-Cookie','token=' + token);
restMessage.setHttpMethod("post");
restMessage.setEndpoint(endpoint);
var response = restMessage.execute();
var responseBody = response.getBody();
gs.log("NessusUtil.getScans = " + responseBody);
