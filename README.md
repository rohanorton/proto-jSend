jSend
=====

Express middleware for jSend responses

This module simplifies outputting data which conforms to the jsend specification found at:
http://labs.omniti.com/labs/jsend

### Methods

#### res.jSend(data) 
  data (type: Any, optional)

  res.jSend will infer the status code (200 or 201 from the request http method)
  if jsonp is used req.method is always 'GET' so in this case req._method property must be set to the desired method e.g 'POST'

#### res.jSend.error(options)
  options object properties are:
  message (type: String, required)
  data (type: Object, optional)
  code (type: Number, optional) // this sets the http response code
