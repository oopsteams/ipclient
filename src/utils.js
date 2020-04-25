module.exports = {
	"STATE":{"START":2},
	"POINT":"http://127.0.0.1:8080/",
	"adcachetimeout":144000,//Seconds
	exists:function(s){
		if(s && s.length>0){
			return true;
		}
		return false;
	},
	join: function(domain, path){
		if(domain && path){
			var d_l = domain.length;
			var p_l = path.length;
			if(domain.substring(d_l-1,d_l) == '/'){
				domain = domain.substring(0, d_l-1);
			}
			if(path.substring(0,1) == '/'){
				return domain + path;
			} else {
				return domain + '/' + path;
			}
		}
		return null;
	},
	looper: (function(){
	  var _t = null;
	  var _all_listeners={};
	  var raf_tm = 0;
	  var raf = window.requestAnimationFrame;
	  var caf = window.cancelAnimationFrame;
	  var clearRunningProcess = function(){
		if(raf){
			if(_t && caf)caf(_t);
		} else {
			if(_t)clearTimeout(_t);
		}
	  };
	  if(caf){
		  console.log('use requestAnimationFrame!!!!!!!!!!!!!!!');
	  }
	  var delayRun = function(fn, delay){
		clearRunningProcess();
		if(raf){
			raf_tm = Date.now();
			function animation(){
				_t = raf(function(){
					if(Date.now() - raf_tm >= delay){
						fn();
					} else {
					  animation();
					}
				})
			}
			if(_looper.running){
				animation();
			}
		} else {
			if(_looper.running){
				_t = setTimeout(fn, delay);
			}
		}
	  }
	  function runner(){
	    var will_del = [];
	    for(var uid in _all_listeners){
	      var cb = _all_listeners[uid][0];
	      var _params = _all_listeners[uid][1];
	      if(cb(_params)){
	        will_del.push(uid);
	      }
	    }
	    for(var i=0;i<will_del.length;i++){
	      delete _all_listeners[will_del[i]];
	    }
	    if(_looper.running){
			delayRun(runner, 1000);
	    }
	  }
	  var _looper = {
	    running:false,
	    stop:function(){
	      _looper.running=false;
		  clearRunningProcess();
		  _t = null;
	    },
	    start:function(){
	      if(!_looper.running){
	        _looper.running = true;
			delayRun(runner, 1000);
	      }
	    },
	    removeListener:function(uid){
	      if(_all_listeners.hasOwnProperty(uid)){
	        delete _all_listeners[uid];
	      }
	    },
	    addListener:function(uid, callback, params){
	      _all_listeners[uid] = [callback, params];
	    }
	  };
	  return _looper;
	})()
}
// module.exports = {}