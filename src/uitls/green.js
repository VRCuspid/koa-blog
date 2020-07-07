var http = require('http');
var crypto = require('crypto');
// var uuidV1 = require('uuid/v1');





var greenNodejs = function(bizCfg, callback){
	var accessKeyId = bizCfg['accessKeyId'];
	var accessKeySecret = bizCfg['accessKeySecret'];
	var path = bizCfg['path'];
	var clientInfo = bizCfg['clientInfo'];
	var requestBody = bizCfg['requestBody'];
	var greenVersion = bizCfg['greenVersion'];
	var hostname = bizCfg['hostname'];
    var gmtCreate = new Date().toUTCString();
    var md5 = crypto.createHash('md5');
	// 请求头
	var requestHeaders = {
		'Accept':'application/json',
	    'Content-Type':'application/json',  
	    'Content-MD5':md5.update(requestBody).digest().toString('base64'),
	    'Date':gmtCreate,
	    'x-acs-version':greenVersion,
	    'x-acs-signature-nonce':new Date()*1,
	    'x-acs-signature-version':'1.0',
	    'x-acs-signature-method':'HMAC-SHA1'
	};

	// 对请求的签名
	signature(requestHeaders, bizCfg);

	// HTTP请求设置
	var options = {
	    hostname: hostname,
	    port: 80,
	    path: encodeURI(path + '?clientInfo=' + JSON.stringify(clientInfo)),
	    method: 'POST',
	    headers:requestHeaders
	};


	var req = http.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
          console.log(chunk)
	  	callback(chunk);
	  });
	});

	req.write(requestBody); 
	req.end();  
}

function signature(requestHeaders, bizCfg){
	var accessKeyId = bizCfg['accessKeyId'];
	var accessKeySecret = bizCfg['accessKeySecret'];
	var path = bizCfg['path'];
	var clientInfo = bizCfg['clientInfo'];
	
	var signature = [];
	signature.push('POST\n');
	signature.push('application/json\n');
	signature.push(requestHeaders['Content-MD5'] + '\n');
	signature.push('application/json\n');
	signature.push(requestHeaders['Date'] + '\n');
	signature.push('x-acs-signature-method:HMAC-SHA1\n');
	signature.push('x-acs-signature-nonce:' + requestHeaders['x-acs-signature-nonce'] + '\n');
	signature.push('x-acs-signature-version:1.0\n');
	signature.push('x-acs-version:2017-01-12\n');
	signature.push(path + '?clientInfo=' + JSON.stringify(clientInfo));
	

	var authorization = crypto.createHmac('sha1', accessKeySecret)
                   .update(signature.join(''))
                   .digest().toString('base64');

	requestHeaders.Authorization = 'acs ' + accessKeyId + ':' + authorization;
}

module.exports = greenNodejs;