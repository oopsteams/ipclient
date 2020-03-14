module.exports = {
	"STATE":{"START":2},
	"POINT":"http://127.0.0.1:8080/",
	exists:function(s){
		if(s && s.length>0){
			return true;
		}
		return false;
	}
}
// module.exports = {}