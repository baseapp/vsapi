/*
  @author: remy sharp
  @info: http://leftlogic.com/lounge/articles/microformats_bookmarklet/
  @date: 2007-10-22
  @license: Creative Commons License - ShareAlike http://creativecommons.org/licenses/by-sa/3.0/

  // Modified for Videoswiper by Vikas

  Load by (using graceful wait for prerequsite library):
javascript:(function(){function%20l(u,i,t,b){var%20d=document;if(!d.getElementById(i)){var s=d.createElement('script');s.src=u;s.id=i;d.body.appendChild(s)}s=setInterval(function(){u=0;try{u=t.call()}catch(i){}if(u){clearInterval(s);b.call()}},200)}l('http://leftlogic.com/js/microformats.js','MF_loader',function(){return!!(typeof MicroformatsBookmarklet=='function')}, function(){MicroformatsBookmarklet()})})();
*/
function VideoswiperBookmarklet() {

    // load jQuery if isn't not there in the first place.
    function lateLoader(u,i,t,b){
        var d=document;
        if(!d.getElementById(i)){
            var s=d.createElement('script');
            s.src=u;
            s.id=i;
            d.body.appendChild(s);
        }

        var timer=setInterval(function(){
            var ok=false;
            try{
                ok=t.call();
            }catch(i){}

            if (ok){
                clearInterval(timer);
                b.call();
            }
        },10);
    }

    if (!!!(typeof jQuery=='function') && !window.loadingJQ) {
        window.loadingJQ = true;
        lateLoader('http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js','MF_jq',function(){
            return!!(typeof jQuery=='function');
        }, VideoswiperBookmarklet);
        return false;
    } else if (!!!(typeof jQuery=='function')) {
        return false;
    }

    var jqe = null;
    var run_once = 0;
    var found = 0;
    var photoguid = 0;
    var photocomplete = [];
    var nl = '%0D%0A'; // %0D%0A = nl! yay!
    var server = 'http://leftlogic.com';
    var msie = /*@cc_on!@*/0;

    var shim = server + '/images/shim.gif';
    var mf_logo = server + '/images/microformats.jpg';

    var btnDn = server + '/images/close-down.gif';
    var btnUp = server + '/images/close-up.gif';
    var vcard_image = server + '/images/vcard.gif';
    var ical_image = server + '/images/ical.gif';

    try {
        delete window.loadingJQ;
    } catch (jqe) {
        window.loadingJQ = null;
    }

    $j = jQuery.noConflict();


    function loadMFTB() {
    	removeOverlay();

    	$j('embed').hide();

    	$j('body').append('<div id="MF_box"><div id="MF_topbar"><img title="Close window" id="MF_btnClose" style="cursor: pointer;" alt=" " src="' + btnUp + '" height="14" width="14" /><div id="MF_title">Quick Add Video</div></div><iframe src ="'+appPath+'/?'+encodeURIComponent(location.href)+'" width="500" height="450" frameborder="0"><p>Your browser does not support iframes.</p></iframe></div>');

        var is_safari = navigator.userAgent.indexOf("Safari") > -1;
    	if (!is_safari) $j('#MF_box').hide();
        $j('body').append('<div id="MF_overlay"></div>');

        try {
         $j(window).scroll(positionMicroformatBox);
        } catch (e) {
         // move window on scroll disabled
        }

    	$j('#MF_overlay').click(removeOverlay);
    	$j('#MF_btnClose').hover(function (){
    	    $j(this).attr('src', btnDn);
    	}, function (){
    	    $j(this).attr('src', btnUp);
    	}).click(removeOverlay);

    }

    // only in a function to help manage the styles - IE needs them
    // applied directly to the elements
    function styles() {



        var mfo = $j('#MF_overlay').css({
            'position': 'absolute',
            'zIndex': '9998',
            'width': '100%',
            'height': '100%',
            'top': '0',
            'left': '0',
            'minHeight': '100%',
            'backgroundColor': '#000',
            // 'opacity': 60,
            'filter': 'alpha(opacity=60)'
            // '-moz-opacity':
        }).css('opacity', 0.6);
        overlaySize();



        $j('#MF_box').css({
            'padding': '0px',
            'position': 'absolute',
            'background': '#fff',
            'zIndex': '9999',
            'color': '#000',
            'border': '4px solid #525252',
            'textAlign': 'left'
        });


        $j('#MF_topbar').css({ 	'background-color':'#e8e8e8'});
        $j('#MF_title').css({ 'text-align': 'left','padding':'5px','margin-bottom':'1px','width':'200px' });
        $j('#MF_btnClose').css({ 'float': 'right', 'margin': '0px', 'padding': '5px', 'border': 0 });


    }

    // Special mention to Cody Lindley (http://codylindley.com/Javascript/257/thickbox-one-box-to-rule-them-all)
    // as the overlay code is mostly taken from his ThickBox 2.0 for jQuery.
    function overlaySize() {
    	if (window.innerHeight&&window.scrollMaxY) {
    		yScroll = window.innerHeight + window.scrollMaxY;
    	} else if (document.body.scrollHeight > document.body.offsetHeight) {
    		yScroll = document.body.scrollHeight;
    	} else {
    		yScroll = document.body.offsetHeight;
      	}
    	$j('#MF_overlay').css('height',yScroll +'px');
    }

    function removeOverlay() {
    	$j('#MF_box').remove();
    	$j('#MF_overlay').remove();
    	$j('#MF_jq').remove();
        $j('#MF_loader').remove();
        $j('embed').show();

    }

    function getPageScrollTop() {
    	var yScrolltop;
    	if (self.pageYOffset) {
    		yScrolltop = self.pageYOffset;
    	} else if (document.documentElement&&document.documentElement.scrollTop) {
    		yScrolltop = document.documentElement.scrollTop;
    	} else if (document.body) {
    		yScrolltop = document.body.scrollTop;
    	}
    	arrayPageScroll = new Array('',yScrolltop);
    	return arrayPageScroll;
    }

    function getPageSize() {
    	var de = document.documentElement;
    	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
    	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;

    	arrayPageSize = new Array(w,h);
    	return arrayPageSize;
    }

    function positionMicroformatBox() {
    	var pagesize = getPageSize();
    	var arrayPageScroll = getPageScrollTop();

    	$j('#MF_box').css({width:'500px',left: ((pagesize[0] - 500)/2)+'px', top: (arrayPageScroll[1] + 25)+'px'});
    	overlaySize();
    }


    function cleanEmail(e) {
    	e = e.replace('mailto:', '');
    	return e.replace(/\?.*$j/, '');
    }

    function cleanURL(u) {
    	if (!u.match(/^http/)) {
    		if (u.match(/^\//))	u = location.protocol + '//' + location.hostname + u;
    		else {
    			var parts = location.pathname.split('/');
    			parts.pop();
    			var p = parts.join('/');
    			u = location.protocol + '//' + location.hostname + p + '/' + u;
    		}
    	}
    	return u;
    }

    function cleanString(s, stripNL) {
    	s = s.replace(/^\s+/, '');
    	s = s.replace(/\s+$j/, '');
    	s = s.replace(/( )+/g, ' ');
    	return stripNL ? s.replace(/\n/g, ' ') : s.replace(/\n/g, '\\n'); // plain text!
    }

    function emptyCheck() {
    	if (!found) {
    		var html = '<div class="MF_card">';
    		html += '<p class="MF_header">No microformats could be found.</p>';
    		html += '</div>';
    		$j('#MF_microformats').append(html);
    	}
    }


    loadMFTB();
    emptyCheck();
    styles();
    /*
    if (msie && found) {
        $j('#MF_box A').click(ie_microformat);
    }*/
    positionMicroformatBox();
    $j('#MF_box').fadeIn(600);

}
