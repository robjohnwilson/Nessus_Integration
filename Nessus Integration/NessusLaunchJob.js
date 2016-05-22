var NessusLaunchJob = Class.create();
NessusLaunchJob.prototype = {
    
	initialize: function() {
		this.debug = true;
    },

    getSession: function() {

    	try { 
    		var r = new sn_ws.RESTMessageV2('nessus login', 'post');
    		var response = r.execute();
    		var responseBody = response.getBody();
    		var httpStatus = response.getStatusCode();
    		
    		if (this.debug) {
    			gs.log("NessusUtil.getSession: HttpStatus=" + httpStatus);
    			gs.log("NessusUtil.getSession: Response=" + responseBody);
    		}
    		
    	}
    	catch(ex) {
    		var message = ex.getMessage();
    		if (this.debug) {
    			gs.log("NessusUtil.getSession: Exception:" + message);
    		}
    		
    	}

    	var parser = new JSONParser();
    	var parsed = parser.parse(responseBody);
    	token = parsed.token;
    	return token;
    },
    
    launch: function(token) {
    	
    	gr = new GlideRecord("sn_vasnow_queue");
    	gr.addQuery('state','waiting');
    	gr.query();
    	while (gr.next()) {
    		scanid = gr.scan.id;
    		target = gr.target;
    		gr.state = 'starting';
    		gr.update();
        	endpoint = "https://localhost:8834/scans/" + scanid + "/launch";
        	var restMessage = new sn_ws.RESTMessageV2();
        	restMessage.setRequestHeader('X-Cookie','token=' + token);
        	restMessage.setHttpMethod("post");
        	restMessage.setEndpoint(endpoint);
        	var response = restMessage.execute();
        	var responseBody = response.getBody();
        	gs.log("NessusLaunchJob.launch = " + responseBody);
        	gr.state = 'running';
    		gr.update();
    		
    	}
    	
    },
    
    type: 'NessusLaunchJob'
};