
$(document).ready(function() {
  
    function createrowitem(type,text,id,classname){
        let rowitem = document.createElement('div');
        rowitem.className = 'grid-row';
        let p = document.createElement(type);
        p.innerText = text;
        if(id!=null){
            p.setAttribute('id',id); 
        }
        if(classname!=null){
            p.className = classname;
        }
        rowitem.appendChild(p);
        
        return rowitem;
    }
    function createlandscapelayout(){
        let body = document.body;
        let landscapechild = document.createElement('div');
        landscapechild.className ='section-landscape';
        let gridcontainer = document.createElement('div');
        gridcontainer.className = 'grid-container';

        let item = createrowitem('p','Online');
        gridcontainer.appendChild(item);
        item = createrowitem('p','0','player-count');
        gridcontainer.appendChild(item);

        item = createrowitem('p','Mines');
        gridcontainer.appendChild(item);
        item = createrowitem('p','0','mine-count');
        gridcontainer.appendChild(item);

        item = createrowitem('p','Turn');
        gridcontainer.appendChild(item);
        item = createrowitem('p','You','player-turn');
        gridcontainer.appendChild(item);

        item = createrowitem('p','You');
        gridcontainer.appendChild(item);
        item = createrowitem('p','0','score-you');
        gridcontainer.appendChild(item);

        item = createrowitem('p','Them');
        gridcontainer.appendChild(item);
        item = createrowitem('p','0','score-them');
        gridcontainer.appendChild(item);

        item = createrowitem('p','Time');
        gridcontainer.appendChild(item);
        item = createrowitem('p','0','turn-time');
        
        gridcontainer.appendChild(item);

        
        item = createrowitem('button','Que','join-que-leave-game-button','join-que-button-class');
        gridcontainer.appendChild(item);

        item = createrowitem('button','Toggle','toggle-requests-button','toggle-requests-button-class');
        gridcontainer.appendChild(item);


        item = createrowitem('button','Challenge','challenge-request-button','challenge-request-button-class');
        gridcontainer.appendChild(item);


        landscapechild.appendChild(gridcontainer);

        item = document.createElement('input');
        item.setAttribute('type','text');
        item.setAttribute('id','player-id-input');
        item.setAttribute('class','player-id-input-class');
        item.setAttribute('minlength','0');
        item.setAttribute('maxlength','0');
        item.setAttribute('size','16');
        item.setAttribute('placeholder','player id');

        landscapechild.appendChild(item);


        body.appendChild(landscapechild);


    }
   

    function createsectiontitleinfoitem(text,id,classname){
        let item = document.createElement('div');
        item.className ='section-block';
        let p = document.createElement('p');
        if(id !=null){
            p.setAttribute('id',id);
        }
        if(classname!=null){
            p.className = classname;
        }
        p.innerText = text;
        item.appendChild(p);
        return item;

    }
    function createsectionbuttonitem(text,id,classname){
        let item = document.createElement('div');
        item.className = 'section-block-buttons';
        let button = document.createElement('button');
        button.innerText = text;
        if(id!=null){
            button.setAttribute('id',id);
        }
        if(classname!=null){
            button.className = classname;
        }
        item.appendChild(button);

        return item;
    }

    function createportraitlayout(){
        let body = document.body;
        let sectiontitle = document.createElement('div');
        sectiontitle.className = 'section-title-full';

        let item = createsectiontitleinfoitem('Online');
        sectiontitle.appendChild(item);

        item = createsectiontitleinfoitem('Mines');
        sectiontitle.appendChild(item);

        item = createsectiontitleinfoitem('Turn');
        sectiontitle.appendChild(item);
        
        item = createsectiontitleinfoitem('You');
        sectiontitle.appendChild(item);

        item = createsectiontitleinfoitem('Them');
        sectiontitle.appendChild(item);

        item = createsectiontitleinfoitem('Time');
        sectiontitle.appendChild(item);

        let sectioninfo = document.createElement('div');
        sectioninfo.className = 'section-info-full';

        item = createsectiontitleinfoitem('0','player-count');
        sectioninfo.appendChild(item);

        item = createsectiontitleinfoitem('0','mine-count');
        sectioninfo.appendChild(item);

        item = createsectiontitleinfoitem('You','player-turn');
        sectioninfo.appendChild(item);

        item = createsectiontitleinfoitem('0','score-you');
        sectioninfo.appendChild(item);

        item = createsectiontitleinfoitem('0','score-them');
        sectioninfo.appendChild(item);

        item = createsectiontitleinfoitem('0','turn-time');
        sectioninfo.appendChild(item);

        let buttons = document.createElement('div');
        buttons.className = 'section-buttons-full';

        item = createsectionbuttonitem('Que','join-que-leave-game-button','join-que-button-class');
        buttons.appendChild(item);

        item = createsectionbuttonitem('Toggle','toggle-requests-button','toggle-requests-button-class');
        buttons.appendChild(item);

        item = createsectionbuttonitem('Challenge','challenge-request-button','challenge-request-button-class');
        buttons.appendChild(item);

        let inputdiv = document.createElement('div');
        inputdiv.className = 'section-block-buttons'
        item = document.createElement('input');
        item.setAttribute('type','text');
        item.setAttribute('id','player-id-input');
        item.setAttribute('class','player-id-input-class');
        item.setAttribute('minlength','0');
        item.setAttribute('maxlength','0');
        item.setAttribute('size','16');
        item.setAttribute('placeholder','player id');
        inputdiv.appendChild(item);
        buttons.appendChild(inputdiv);

        body.appendChild(sectiontitle);
        body.appendChild(sectioninfo);
        body.appendChild(buttons);
    }
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
	window.settings;
if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    $('.rrssb-email').remove();
    window.settings = {
        os: "other",
        platform: "mobile",
        baseScale: 1.4,
        scale: 1,
        prevScale: 1,
        baseBlockHeight: 25,
        blockHeight: 30,
    };
} else {
    window.settings = {
        os: "other",
        platform: "nonmobile",
        baseScale: 1,
        scale: 1,
        prevScale: 1,
        baseBlockHeight: 25,
        blockHeight: 30,
    };

}
if(/Android/i.test(navigator.userAgent)) {
    window.settings.os = "android";
}

if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)){
    window.settings.os="ios";
}
window.scaletilescallback = null;
window.canvas = document.getElementById('canvas');
window.ctx = canvas.getContext('2d');
window.rough = rough.canvas(window.canvas);
window.trueCanvas = {
    width: canvas.width,
    height: canvas.height
};
window.scaleCanvas = function() {
	window.canvas.width = $(window).width()*1;
    window.canvas.height = $(window).height()*1;
    
	if (canvas.height > canvas.width) {
        window.canvas.height*=.85;
        window.settings.scale = (canvas.width / 800) * settings.baseScale;
        if(!isInStandaloneMode()&&window.settings.platform=="mobile"){

        }else{
            
        }
        createportraitlayout();
	} else {
       
            window.canvas.width*=.85;
            window.canvas.height*=.97;
        window.settings.scale = (canvas.height / 800) * settings.baseScale;
        createlandscapelayout();
        
	}

	window.trueCanvas = {
		width: canvas.width,
		height: canvas.height
	};

	if (window.devicePixelRatio) {
		var cw = $("#canvas").attr('width');
		var ch = $("#canvas").attr('height');

		$("#canvas").attr('width', cw * window.devicePixelRatio);
		$("#canvas").attr('height', ch * window.devicePixelRatio);
		$("#canvas").css('width', cw);
		$("#canvas").css('height', ch);

		window.trueCanvas = {
			width: cw,
			height: ch
		};

        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        if(window.scaletilescallback){
            window.scaletilescallback();
        }
	}
   // setBottomContainer();
   // set_score_pos();
}

window.sethandlersmobile = function(callbackstart,callbackend,callbackmove){
    window.canvas.addEventListener('touchstart',callbackstart,false);
    window.canvas.addEventListener('touchend',callbackend,false);
    window.canvas.addEventListener('touchmove',callbackmove,false);
}
window.sethandlersdesktop = function(clickcallback,movecallback){
    window.canvas.addEventListener('click',clickcallback,false);
    window.canvas.addEventListener('mousemove',movecallback,false);
}
$(window).resize(window.scaleCanvas);
window.scaleCanvas();
/////
function doOnOrientationChange() {
    switch(window.orientation) {  
      case -90: case 90:
        //createlandscapelayout();
        
        break; 
      default:
        break; 
    }
    location.reload();
    return false;
}
  
window.addEventListener('orientationchange', doOnOrientationChange);


//doOnOrientationChange();
});
