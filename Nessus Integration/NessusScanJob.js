var NessusScanJob = Class.create();
NessusScanJob.prototype = {
    
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
    
    syncScans: function(token) {
    	

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
	if (this.debug) {
		gs.log("NessusUtil.syncScans: HttpStatus=" + httpStatus);
		gs.log("NessusUtil.syncScans: Response=" + responseBody);
	}

   	var parser = new JSONParser();
	var parsed = parser.parse(responseBody);
	x = 0;
	while (scan = parsed.scans[x]) {        	
		gs.log("Found scan " + scan.name);
		
		//get folder sysid
		fgr = new GlideRecord("sn_vasnow_scan_folders");
		fgr.addQuery('id',scan.folder_id);
		fgr.query();
		folderSysId = '';
		while (fgr.next()) {
			folderSysId = fgr.sys_id;
		}
		
		gr = new GlideRecord("sn_vasnow_scans");
		gr.addQuery('id',scan.id);
		gr.addQuery('name',scan.name);
		gr.addQuery('folder_id', scan.folder_id);
		gr.query();
		scanSysId = '';
		while (gr.next()) {
			scanSysId = gr.sys_id;
			gr.uuid = scan.uuid
			gr.name = scan.name;
			gr.owner = scan.owner;
			gr.state = scan.status;
			gr.start = scan.starttime;
			gr.update();
		}
		if (scanSysId == '') {
			//insert
			grScan = new GlideRecord("sn_vasnow_scans");
			grScan.initialize();
			grScan.name = scan.name;
			grScan.uuid = scan.uuid;
			grScan.owner = scan.owner;
			grScan.state = scan.state;
			grScan.start = scan.start;
			grScan.id = scan.id;
			grScan.insert();
		} 
		x++;
	}
   	
    },
    
    type: 'NessusScanJob'
};