var NessusFolderJob = Class.create();
NessusFolderJob.prototype = {
    
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
    
    syncFolders: function(token) {
    	

   	 try { 
   	 var r = new sn_ws.RESTMessageV2('nessus list folders', 'get');
   	 r.setRequestHeader('X-Cookie','token=' + token);
 	 //r.setHttpMethod("get");
	 //r.setEndpoint("https://localhost:8834/scans/");
   	 var response = r.execute();
   	 var responseBody = response.getBody();
   	 var httpStatus = response.getStatusCode();
   	}
   	catch(ex) {
   	 var message = ex.getMessage();
   	}
	if (this.debug) {
		gs.log("NessusUtil.syncFolders: HttpStatus=" + httpStatus);
		gs.log("NessusUtil.syncFolders: Response=" + responseBody);
	}

   	var parser = new JSONParser();
	var parsed = parser.parse(responseBody);
	x = 0;
	while (folder = parsed.folders[x]) {        	
		gs.log("Found folder " + folder.name);
		
		gr = new GlideRecord("sn_vasnow_scan_folders");
		gr.addQuery('id',folder.id);
		gr.query();
		folderSysId = '';
		while (gr.next()) {
			folderSysId = gr.sys_id;
			gr.name = folder.name;
			gr.type = folder.type;
			gr.update();
		}
		if (folderSysId == '') {
			//insert
			grfolder = new GlideRecord("sn_vasnow_scan_folders");
			grfolder.initialize();
			grfolder.name = folder.name;
			grfolder.type = folder.type;
			grfolder.id = folder.id;
			grfolder.insert();
		} 
		x++;
	}
   	
    },
    
    type: 'NessusFolderJob'
};