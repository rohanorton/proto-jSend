jSend
=====

Express middleware for jSend responses

When using this module all output json should conform to the jsend specification found at:
http://labs.omniti.com/labs/jsend


### Methods

#### res.jSend(data, metadata) 
  data and metadata are optional.


#### res.jSend.error(options)
  options properties are:
  message (optional)
  data (optional)
  code (optional) // this sets the http response code

   
