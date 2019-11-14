( function( d , u ){
"use strict";
var w = d.defaultView;
var x = new XMLHttpRequest();
var i = [];
function upLoad ( f , r , fi , m ){
	var _fd = new FormData();
	this._d = document.getElementById( f ).files[0];
	_fd.append( f , this._d );
	this._f = _fd;
	this._r = r;
	this._fi = fi;
	this._m = m;
	this._x = x;
	this.OK = !1;
    if ( this._s() ){
    	this.OK = !0;
    	this._g();
    }
    i.push( this );
    
    return this;
}

var p = upLoad.prototype;

p._s = function(){
	if( this._fi || this._m )
	{
		var i
		, fg = !1
		, fi = this._fi
		, fl = this._d.name.split('.')[1].toLowerCase()
		, fm;
		if( this._m.indexOf('m') > 0 )
		{
			fm = parseInt( this._m.split( 'm' ) )
			fm = fm*1024*1024
		}
		else if( this._m.indexOf('g') > 0 )
		{
			fm = parseInt( this._m.split( 'g' ) )
			fm = fm*1024*1024*1024
		}
		else{ fm = 0 ; return !0; }
		for( i = 0 ; i < fi.length ; i++ ){
			if( fi[i] == fl ){ 
				fg = !0;
				break;
			}
		}
		if( !fg ){ return !1;}
		if( this._d.size > fm ){ return !1;}
		else{ return !0;}
	}else
	{
		return !0;
	}
}
p._g = function(){
	this._x.upload.addEventListener( "progress" , this.pr , false );
	this._v( "load" , this.co , false);
	this._v( "error" , this.fa , false);
	this._v( "abort" , this.ca , false); 
	this._x.open( "POST" , this._r );
    this._x.send( this._f );
    return this;
}
p._v = function( v , f , l ){
	this._x.addEventListener( v , f , l );
}
p.pr = function( e ){
	if (e.lengthComputable) {
		var pC = Math.round(e.loaded * 100 / e.total);
		return (pC.toString() + '%');
	} else {
		return 'unable to compute';
	}
	console.log( e )
}
p.co = function( e ){
	/*success*/
	var di = e.target.response;
	var dJ = JSON.parse( di );
//	alert( dJ["guid"] );
//	alert( dJ["src"] );
	var ed = new getvalue( dJ["guid"] , dJ["src"]);
	
//	alert( e.target.response )
	console.log( e )
}
p.fa = function( e ){
	/*failed*/
	console.log( e )
}
p.ca = function( e ){
	/*cancel*/
	console.log( e )
}
w.upload = upLoad;
})(document);
