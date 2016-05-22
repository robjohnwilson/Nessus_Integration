var NessusUtil = Class.create();
NessusUtil.prototype = {
    
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
    
    getScans: function(token) {
    	

    	 try { 
    	 var r = new sn_ws.RESTMessageV2('nessus get scans', 'get');
    	 r.setRequestHeader('X-Cookie','token=' + token);
    	 var response = r.execute();
    	 var responseBody = response.getBody();
    	 var httpStatus = response.getStatusCode();
    	}
    	catch(ex) {
    	 var message = ex.getMessage();
    	}
    	gs.log("NessusUtil.getScans = " + responseBody);
       	var parser = new JSONParser();
    	var parsed = parser.parse(responseBody);
    	x = 0;
    	while (scan = parsed.scans[x]) {
    		gs.log("Found scan " + scan.name);
    		name = scan.name;
    		uuid = scan.uuid;
    		owner = scan.owner;
    		id = scan.id;
    		folder = scan.folder_id;
    		
    		// check if scan is new
    		grscan = new GlideRecord("sn_vasnow_scans");
    		grscan.addQuery("id",id);
    		grscan.query();
    		scansysid = '';
    		while(grscan.next()) {
    			scansysid = grscan.sys_id;
    		}
    		
    		
    		// check folder / or create
    		grfolder = new GlideRecord("sn_vasnow_scan_folders");
    		grfolder.addQuery('id',folder);
    		grfolder.query();
    		var foldersysid = '';
    		while (grfolder.next()) {
    			foldersysid = grfolder.sys_id; 
        		gs.log("FOUND FOLDER");
    		}
    		if (foldersysid == '') {
    			//insert
        		gs.log("INSERTING FOLDER");

    			grfoldernew = new GlideRecord("sn_vasnow_scan_folders");
    			grfoldernew.initialize();
    			grfoldernew.id = folder;
    			foldersysid = grfoldernew.insert();
    		}
    		state = scan.status;
    		
    		
    		//insert scan
    		if (scansysid == '') {
    			
	    		gr = new GlideRecord("sn_vasnow_scans");
	    		gr.initialize();
	    		gr.name = name;
	    		gr.id = id;
	    		gr.owner = owner;
	    		gr.uuid = uuid;
	    		gr.state = state;
	    		gr.folder = foldersysid;
	    		gr.insert();
    		} else{ 
    			
    			
    		}
    	}
    		x++;
    		gs.log("x=" + x);
    	},
    	

    	getScanResults: function(token) {
    		
        	gs.log("TOKEN=" + token);
          	 try { 

             	var restMessage = new sn_ws.RESTMessageV2();
            	restMessage.setRequestHeader('X-Cookie','token=' + token);
            	restMessage.setHttpMethod("get");
            	restMessage.setEndpoint("https://localhost:8834/scans/");
            	var response = restMessage.execute();
            	var responseBody = response.getBody();
            	 var httpStatus = response.getStatusCode();
            	}
            	catch(ex) {
            	 var message = ex.getMessage();
            	}
            	gs.log("NessusUtil.getScanResults = " + responseBody);
               	var parser = new JSONParser();
            	var parsed = parser.parse(responseBody);
            	x = 0;
            	while (scan = parsed.scans[x]) {        	
            		gs.log("Found scan " + scan.name);
            		name = scan.name;
            		uuid = scan.uuid;
            		owner = scan.owner;
            		id = scan.id;
            		
            		sq = new GlideRecord("sn_vasnow_scans");
            		sq.addQuery("id", id);
            		sq.query();
            		scansysid = '';
            		while (sq.next()) {
            			scansysid = sq.sys_id;
            		}
            		
                	endpoint = "https://localhost:8834/scans/" + id;

                	var restMessage = new sn_ws.RESTMessageV2();
                	restMessage.setRequestHeader('X-Cookie','token=' + token);
                	restMessage.setHttpMethod("get");
                	restMessage.setEndpoint(endpoint);
                	var response = restMessage.execute();
                	var responseBody = response.getBody();
                	gs.log("NessusUtil.getScanResults = " + responseBody);
                   	var parser2 = new JSONParser();
                	var parsed2 = parser2.parse(responseBody);
                	info = parsed2.info;
                	detailName = info.name;
                	detailuuid = info.uuid;
                	detailTargets = info.targets;
                	detailFolderid = info.folder_id;
                	detailScanStart = info.scan_start;
                	detailObjectID = info.object_id;
                	dt = new GlideRecord("sn_vasnow_scan_details");
                	dt.initialize();
                	dt.uuid = detailuuid;
                	dt.targets = detailTargets;
                	dt.folder_id = detailFolderid;
                	dt.scan_start = detailScanStart;
                	dt.name = detailName;
                	dt.scan_id = detailObjectID;
                	dt.object_id = detailObjectID;
                	dt.scan = scansysid;
                	dt.status = info.status;
                	dtsysid = dt.insert();
                	
                	v = 0;
                	while (vul = parsed2.vulnerabilities[v]) {
                		grvul = new GlideRecord("sn_vasnow_scan_detail_vul");
                		grvul.initialize();
                		grvul.detail = dtsysid;
                		grvul.plugin_id = vul.plugin_id;
                		grvul.plugin_name = vul.plugin_name;
                		grvul.plugin_family = vul.plugin_family;
                		grvul.severity_index = vul.severity_index;
                		grvul.count = vul.count;
                		grvul.vuln_index = vul.vuln_index;
                		grvul.insert();
                		v++;
                		
                	}
                	
                	x++;
            	}

    },
    
    launchScan: function(scanId, targetHosts) {
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

    	endpoint = "https://localhost:8834/scans/" + scanID + "/launch";

    	var restMessage = new sn_ws.RESTMessageV2();
    	restMessage.setRequestHeader('X-Cookie','token=' + token);
    	restMessage.setHttpMethod("post");
    	restMessage.setEndpoint(endpoint);
    	var response = restMessage.execute();
    	var responseBody = response.getBody();
    	gs.log("NessusUtil.getScans = " + responseBody);  	
    	return result_uuid;
    },
    
    
    
    
    
    type: 'NessusUtil'
};