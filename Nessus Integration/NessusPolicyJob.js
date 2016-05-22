var NessusPolicyJob = Class.create();
NessusPolicyJob.prototype = {
    
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
    
    syncPolicy: function(token) {
    	

   	 try { 
   	 var r = new sn_ws.RESTMessageV2('nessus list policies', 'get');
   	 r.setRequestHeader('X-Cookie','token=' + token);
   	 var response = r.execute();
   	 var responseBody = response.getBody();
   	 var httpStatus = response.getStatusCode();
   	}
   	catch(ex) {
   	 var message = ex.getMessage();
   	}
	if (this.debug) {
		gs.log("NessusUtil.syncPolicy: HttpStatus=" + httpStatus);
		gs.log("NessusUtil.syncPolicy: Response=" + responseBody);
	}

   	var parser = new JSONParser();
	var parsed = parser.parse(responseBody);
	x = 0;
	while (policy = parsed.policies[x]) {        	
		gs.log("Found Policy " + policy.name);
		
		gr = new GlideRecord("sn_vasnow_policies");
		gr.addQuery('id',policy.id);
		gr.query();
		policySysId = '';
		while (gr.next()) {
			policySysId = gr.sys_id;
			gr.name = policy.name;
			gr.description = policy.description;
			gr.owner_id = policy.owner_id;
			gr.owner = policy.owner;
			gr.template_uuid = policy.template_uuid;
			gr.update();
		}
		if (policySysId == '') {
			//insert
			grPolicy = new GlideRecord("sn_vasnow_policies");
			grPolicy.initialize();
			grPolicy.name = policy.name;
			grPolicy.description = policy.description;
			grPolicy.id = policy.id;
			grPolicy.template_uuid = policy.template_uuid;
			grPolicy.owner = policy.owner;
			grPolicy.owner_id = policy.owner_id;
			grPolicy.insert();
		} 
		x++;
	}
   	
    },
    
    type: 'NessusPolicyJob'
};