x = new NessusUtil();
t = x.getSession();
x.getScans(t);


x = new NessusUtil();
t = x.getSession();
x.getScanResults(t);


x = new NessusFolderJob();
t = x.getSession();
x.syncFolders(t);

x = new NessusPolicyJob();
t = x.getSession();
x.syncPolicy(t);

x = new NessusLaunchJob();
t = x.getSession();
x.launch(t);


{"folders":
	[{"unread_count":0,"custom":0,"default_tag":1,"type":"main","name":"My Scans","id":2},{
		"unread_count":null,"custom":0,"default_tag":0,"type":"trash","name":"Trash","id":3}],

"scans":[
         {"folder_id":2,
        	 "read":true,
        	 "last_modification_date":1427455757,
        	 "creation_date":1426984487,
        	 "status":"aborted",
        	 "uuid":"8418dec6-0cf0-2fe1-2f1f-f6e675fa68d435eea77cf753abf6",
        	 "shared":false,
        	 "user_permissions":128,
        	 "owner":"rob.wilson",
        	 "timezone":null,"rrules":null,
        	 "starttime":null,"enabled":false,"control":true,
        	 "name":"localhost",
        	 "id":5},
       {"folder_id":2,
        		 "read":true,
        		 "last_modification_date":1427038222,
        		 "creation_date":1427038216,
        		 "status":"completed",
        		 "uuid":"d0f573bf-cf26-6cf8-75e3-d951b81e7c6ddd58558ae5967b5a",
        		 "shared":false,
        		 "user_permissions":128,
        		 "owner":"rob.wilson",
        		 "timezone":null,"rrules":null,
        		 "starttime":null,"enabled":false,"control":true,"name":"local host discovery","id":8},
       {"folder_id":2,"read":true,"last_modification_date":1426983448,"creation_date":1426981860,
        			 "status":"completed","uuid":"ad8b5140-265b-16a8-5703-46c5b4b84bd7b50f3dc0542cd27e","shared":false,"user_permissions":128,
        			 "owner":"rob.wilson","timezone":null,"rrules":null,"starttime":null,"enabled":false,"control":true,"name":"web app localhost","id":11}]
,"timestamp":1428239691}


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
	 r.setRequestHeader('X-Cookie','token=' + token);

restMessage.setHttpMethod("post");
restMessage.setEndpoint(endpoint);
var response = restMessage.execute();