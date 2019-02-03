/*!
 * cPainting JavaScript Modul v2.0
 *
 * Application for drawing in canvas 
 *
 * developed by Ivan Bugaev
 * mailto: ivan-753s@mail.ru
 * 
 * Date: 2017-11-24 22:06
 *
 * documentation   https://github.com/Ivan753/canvas-painting
 */

 
 
(function(){

// object Settings
var Settings = {
        
    width: 500,                  //width canvas
    height: 500,                 //height
    bg: '#ffffff',               //background-color
    opacity: 1,                  //
    menu: {                      //control 
        level: 'less',            //level control: none, less, pro
        position: 'absolute',    //position control
        backgroundColor:'#ffffff',
        opacity: 0.9,
        color: '#555555',
        border: '1px solid #555555'
    },
    means: 'pen',                //drawing tools: pen, pointer, cleaner, line, rectangle, circle
    using_tool: {
        pen: true,
        pointer: false,
        cleaner: false,
        line: false,
        rectangle: false,
        circle: false
    },
    cleaner: {                   //cleaner's size
        width: 50,
        height: 20,
        act: false
    },
    color: '#000055',//color tool
    fill_color: '#000055',//color to fill
    fill: false,
    sizeLine: 10,                 //size tool (px)
    standart_colors: ['#ff0000', '#00ff00', '#0000ff', '#ffa500', '#a5ff00', '#00a5ff', '#ff00a5', '#000000', '#ffffff'], //standart colors for less level control
    ln: 'en'

}


// language settings, default:ru

switch(Settings.ln){
    
    case 'en':    
        var TEXT_inp_size = 'size (px)',
        TEXT_inp_color = 'color',
        TEXT_fill_inp_color = 'fill color',
        TEXT_change_fill = 'fill',
        TEXT_inp_means = 'tools',
        TEXT_pen = 'pen',
        TEXT_pointer = 'pointer',
        TEXT_line = 'line',
        TEXT_rectangle = 'rectangle',
        TEXT_circle = 'circle',
        TEXT_cleaner = 'cleaner',
        TEXT_inp_sett_cleaner_width = 'width',
        TEXT_inp_sett_cleaner_height = 'height',
        TEXT_setting_cleaner = "Cleaner's settings: ";
    break;

    case 'ru':
        var TEXT_inp_size = 'размер (px)',
        TEXT_inp_color = 'цвет кисти',
        TEXT_fill_inp_color = 'цвет заливки',
        TEXT_change_fill = 'заливка',
        TEXT_inp_means = 'инструменты',
        TEXT_pen = 'ручка',
        TEXT_pointer = 'точечное рисование',
        TEXT_line = 'линия',
        TEXT_rectangle = 'прямоугольник',
        TEXT_circle = 'круг',
        TEXT_cleaner = 'ластик',
        TEXT_inp_sett_cleaner_width = 'ширина',
        TEXT_inp_sett_cleaner_height = 'высота',
        TEXT_setting_cleaner = "Характеристики ластика: ";
    break;

    default: 
        var TEXT_inp_size = 'size (px)',
        TEXT_inp_color = 'color',
        TEXT_fill_inp_color = 'fill color',
        TEXT_change_fill = 'fill',
        TEXT_inp_means = 'tools',
        TEXT_pen = 'pen',
        TEXT_pointer = 'pointer',
        TEXT_line = 'line',
        TEXT_rectangle = 'rectangle',
        TEXT_circle = 'circle',
        TEXT_cleaner = 'cleaner',
        TEXT_inp_sett_cleaner_width = 'width',
        TEXT_inp_sett_cleaner_height = 'height',
        TEXT_setting_cleaner = "Cleaner's settings: ";
    break;

}



startCreateDesigner = (function(){

// try-catch for to shorten the code

try{
    
    // create canvas
    var doc;

    if (document.getElementById) doc = document.getElementById('CanvasDrawerADIO');
    else if (document.all) doc = document.all['CanvasDrawerADIO'];


    if(!doc){
        throw 'ADIO_Error: Element CanvasDrawerADIO not found.';
    }
    
    
    if(doc.tagName.toLowerCase() != 'div'){ 
        throw 'ADIO_Error: incorrect tagName "'+doc.tagName.toLowerCase()+'". You can using "div" only.';
    }
        
    doc.innerHTML = '';

    var canvas = document.createElement('canvas');

    canvas.setAttribute('width', Settings.width + 'px');
    canvas.setAttribute('height', Settings.height + 'px');

    canvas.style.position = 'absolute';
    canvas.style.backgroundColor = Settings.bg;
    canvas.style.border = '1px solid #000';
    canvas.id = 'CanvasDrawerADIO1';
    doc.appendChild(canvas);


    var ctx = canvas.getContext('2d');

    // summ all margins
    var elem = canvas;
        
    var top = 1, left = 1;
    
    while(elem){
        top = top + parseFloat(elem.offsetTop + parseInt(getComputedStyle(elem).paddingTop));
        left = left + parseFloat(elem.offsetLeft + parseInt(getComputedStyle(elem).paddingLeft));
        elem = elem.offsetParent;
    }

    // create cleaner
    var mini_cleaner = document.createElement('div');
    mini_cleaner.style.position = 'absolute';
    mini_cleaner.style.display = 'none';
    mini_cleaner.style.border = '1px solid #555';
    mini_cleaner.style.backgroundColor = '#fff';
    mini_cleaner.style.zIndex = 1000;
    mini_cleaner.style.pointerEvents = "none";
    doc.appendChild(mini_cleaner);
    
    // create block for tool
    var tool = document.createElement('div');
    tool.id = "CanvasDrawerADIO_tool";
    tool.down = false;
    tool.width = '0px';
    tool.height = '0px';
    tool.py_bool = false;   // for forward-backward rendering
    tool.px_bool = false;   // for forward-backward rendering
    tool.style.position = 'absolute';
    tool.style.zIndex = 1000;
    tool.style.display = "none";
    tool.style.pointerEvents = "none";
    doc.appendChild(tool);
    
    
    
    // events definition

    canvas.onmousedown = function(e){
        
        paint = true;

        if(Settings.using_tool.rectangle == true && tool.down == false){
            tool.style.left = e.pageX - 2*Settings.sizeLine - 3;
            tool.style.top = e.pageY - 2*Settings.sizeLine - 3;
            tool.down = true;
            return;
        }else{
            if(Settings.using_tool.circle == true && tool.down == false){
                tool.style.left = e.pageX - 2*Settings.sizeLine - 3;
                tool.style.top = e.pageY - 2*Settings.sizeLine - 3;
                tool.down = true;
                return;
            }else{
                addClick(e.pageX - left, e.pageY - top);
                redraw();
            }
        
        }
        
    };


    canvas.onmousemove = function(e){

        // draw act and no act tools

        if(Settings.using_tool.rectangle == true && tool.down == false){
            tool.style.left = e.pageX - 2*Settings.sizeLine - 3;
            tool.style.top = e.pageY - 2*Settings.sizeLine - 3;
            return;
        }
        
        if(Settings.using_tool.rectangle == true && tool.down == true){
            
            // forward and backward rendering
            // for moving on the left-right
            let t = ((tool.px_bool == false)?(parseInt(tool.style.left) + 2*Settings.sizeLine):(tool.px + 2*Settings.sizeLine));
            
            if(e.pageX > t){    
                tool.style.width = Math.abs(e.pageX - parseInt(tool.style.left) - 2*Settings.sizeLine) - 3;
                tool.px_bool = false;
            }else{
                    
                if(tool.px_bool == false){ 
                    tool.px = parseInt(tool.style.left);
                    tool.px_bool = true;
                }
                
                tool.style.width = Math.abs(parseInt(tool.style.left) - tool.px - 2*Settings.sizeLine) - 3;
                tool.style.left = Math.abs(e.pageX - 2*Settings.sizeLine) ;
            }
            
            
            // for moving on the up-down
            t = ((tool.py_bool == false)?(parseInt(tool.style.top) + 2*Settings.sizeLine):(tool.py + 2*Settings.sizeLine));
            if(e.pageY > t){    
                tool.style.height = Math.abs(e.pageY - parseInt(tool.style.top) - 2*Settings.sizeLine) - 3;
                tool.py_bool = false;
            }else{
                    
                if(tool.py_bool == false){ 
                    tool.py = parseInt(tool.style.top);
                    tool.py_bool = true;
                }
                
                tool.style.height = Math.abs(parseInt(tool.style.top) - tool.py - 2*Settings.sizeLine) - 3;
                tool.style.top = Math.abs(e.pageY - 2*Settings.sizeLine) ;
            }
            
            return;
        }
        

        if(Settings.using_tool.circle == true && tool.down == false){
            tool.style.left = e.pageX - 2*Settings.sizeLine - 3;
            tool.style.top = e.pageY - 2*Settings.sizeLine - 3;
            return;
        }
        
        if(Settings.using_tool.circle == true && tool.down == true){
            
            // forward and backward rendering
            let t = ((tool.px_bool == false)?(parseInt(tool.style.left) + 2*Settings.sizeLine):(tool.px + 2*Settings.sizeLine));
			
			if(e.pageX > t){	
				tool.style.width = Math.abs(e.pageX - parseInt(tool.style.left) - 2*Settings.sizeLine) - 3;
				tool.style.height =  Math.abs(e.pageX - parseInt(tool.style.left) - 2*Settings.sizeLine) - 3;
				tool.px_bool = false;
			}else{
					
				if(tool.px_bool == false){ 
					tool.px = parseInt(tool.style.left);
					tool.py = parseInt(tool.style.top);
					tool.px_bool = true;
				}
				
				tool.style.width = Math.abs(parseInt(tool.style.left) - tool.px - 2*Settings.sizeLine) - 3;
				tool.style.left = Math.abs(e.pageX - 2*Settings.sizeLine) ;
				tool.style.height = Math.abs(parseInt(tool.style.left) - tool.px - 2*Settings.sizeLine) - 3;
			}
            
            return;
        }
        
        

        if(paint){
            addClick(e.pageX - left, e.pageY - top, true);
            redraw();
        }
        
        mini_cleaner.style.left = e.pageX+3;
        mini_cleaner.style.top = e.pageY+3;
        
    };



    canvas.onmouseup = function(e){
        
        paint = false;
        
        // draw rectangle
        
        if(Settings.using_tool.rectangle == true && tool.down == true){
            
            tool.down = false;

            ctx.strokeStyle = Settings.color;
            ctx.fillStyle = Settings.fill_color;
            ctx.lineJoin = 'round';
            ctx.lineCup = 'none';
            ctx.lineWidth = Settings.sizeLine;
            ctx.beginPath();
            ctx.rect(parseInt(tool.style.left) - left + Settings.sizeLine/2, parseInt(tool.style.top) - top + Settings.sizeLine/2, parseInt(tool.style.width) + Settings.sizeLine, parseInt(tool.style.height) + Settings.sizeLine);
            ctx.closePath();
            if(Settings.fill) ctx.fill();
            ctx.stroke();
            
            Settings.using_tool.rectangle = false;
            tool.style.width = "0px";
            tool.style.height = "0px";
            tool.style.display = "none";
            clickX = [];
            clickY = [];
            clickclickDrag = [];
            return;
        }
        
        
        
        // draw circle
        
        if(Settings.using_tool.circle == true && tool.down == true){
            tool.down = false;
            
            ctx.strokeStyle = Settings.color;
            ctx.fillStyle = Settings.fill_color;
            ctx.lineJoin = 'round';
            ctx.lineCup = 'none';
            ctx.lineWidth = Settings.sizeLine;
            ctx.beginPath();
            ctx.arc(parseInt(tool.style.left) - left + Settings.sizeLine + parseInt(tool.style.width)/2, parseInt(tool.style.top) - top + Settings.sizeLine + parseInt(tool.style.width)/2, parseInt(tool.style.width)/2 + Settings.sizeLine/2, 0, 2*Math.PI, true);
            ctx.closePath();
            if(Settings.fill) ctx.fill();
            ctx.stroke();
            
            Settings.using_tool.circle = false;
            tool.style.width = "0px";
            tool.style.height = "0px";
            tool.style.display = "none";
            clickX = [];
            clickY = [];
            clickclickDrag = [];
            return;
        }

        if((Settings.means == 'pen') || (Settings.means == 'cleaner')){ //
            clickX = [];
            clickY = [];
            clickclickDrag = [];
        }
        
        
    };



    canvas.onmouseleave = function(e){
        paint = false;

        if(Settings.using_tool.rectangle == true && tool.down != false){
            tool.down = false;
            return;
        }
        if(Settings.using_tool.circle == true && tool.down != false){
            tool.down = false;
            return;
        }
        
        if((Settings.means == 'pen') || (Settings.means == 'cleaner')){ //clear x y
            clickX = [];
            clickY = [];
            clickclickDrag = [];
        }
        


        
    };


    // init necessary variable for rules darwing
    
    var clickX =  [];
    var clickY =  [];
    var clickDrag =  [];
    var paint;

    function addClick(x, y, dragging){
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    }



    // default params
    
    ctx.fillStyle = Settings.fill_color;
    ctx.strokeStyle = Settings.color;
    ctx.lineJoin = 'round';
    ctx.lineCup = 'round';
    ctx.lineWidth = Settings.sizeLine;
    
    if(Settings.cleaner.act == false){
        mini_cleaner.style.display=  "none";
    }
    
    
    
    // draw current map
    
    function redraw(){
            
        switch(Settings.means){
        case 'pen':

            Settings.using_tool.rectangle = false;

            Settings.cleaner.act = false;
        
            mini_cleaner.style.display = 'none';
        
            for(var i=0; i < clickX.length; i++) {        
            ctx.beginPath();
            if(clickDrag[i] && i){
            ctx.moveTo(clickX[i-1], clickY[i-1]);
            }else{
            ctx.moveTo(clickX[i]-1, clickY[i]);
            }

            ctx.lineTo(clickX[i], clickY[i]);
            ctx.closePath();
            ctx.stroke();
            }

            
        break;

        case 'pointer':
            
            Settings.using_tool.rectangle = false;
            
            Settings.cleaner.act = false;        

            mini_cleaner.style.display = 'none';
        
            ctx.lineJoin = 'round';
            ctx.lineCup = 'round';

            for(var i=0; i < clickX.length; i++) {        
            ctx.beginPath();
            if(clickDrag[i] && i){
            ctx.moveTo(clickX[i-1], clickY[i-1]);
            }else{
            ctx.moveTo(clickX[i]-1, clickY[i]);
            }

            ctx.lineTo(clickX[i], clickY[i]);
            ctx.closePath();
            ctx.stroke();
            }

            // ! clear x y 
            clickX = [];
            clickY = [];
            clickclickDrag = [];
            

        break;

        
        case 'rectangle':
        
        if(Settings.using_tool.rectangle != true) {
            Settings.using_tool.rectangle = true;
        }
        
        tool.style.border = Settings.sizeLine+'px'+' solid '+Settings.color;
        tool.style.borderRadius = '5px';
        tool.style.display = 'block';
        
        
        
        
        break;
        
        case 'circle':

        if(Settings.using_tool.circle != true) {
            Settings.using_tool.circle = true;
        }
        
        tool.style.border = Settings.sizeLine+'px'+' solid '+Settings.color;
        tool.style.borderRadius = '100%';
        tool.style.display = 'block';        
    
        break;
        
        
        
        case 'cleaner':
            
            Settings.cleaner.act = true;
            
            mini_cleaner.style.width = Settings.cleaner.width + 'px';
            mini_cleaner.style.height = Settings.cleaner.height + 'px';
            mini_cleaner.style.display = 'block';
            
            ctx.lineJoin = 'none';
            ctx.lineCup = 'none';

            for(var i=0; i < clickX.length; i++) {        
            ctx.beginPath();
            if(clickDrag[i] && i){
            ctx.moveTo(clickX[i-1], clickY[i-1]);
            }else{
            ctx.moveTo(clickX[i]-1, clickY[i]);
            }
            
            ctx.clearRect(clickX[i], clickY[i], parseInt(mini_cleaner.style.width)+3, parseInt(mini_cleaner.style.height)+3); // Очистим холст    
            ctx.closePath();
            ctx.stroke();
            }


        break;

        default: throw 'ADIO_Error: incorrect setting.means .'; break;

        }
    }


    
    
    var change_style = (function(n){
        switch(n){
            case 1: 
                ctx.lineWidth = inp_size.value; Settings.sizeLine = inp_size.value; 
                tool.style.border = Settings.sizeLine+'px'+' solid '+Settings.color; 
            break;
            case 2: 
                ctx.strokeStyle = color_inp.value; Settings.color = color_inp.value;
                tool.style.border = Settings.sizeLine+'px'+' solid '+Settings.color;  
            break;
            case 3: Settings.means = inp_means.value;  break;
            case 4: sweeping(); Settings.means = select_mean.value; inp_means.value = select_mean.value; redraw(); break;
            case 'width_cleaner': 
                Settings.cleaner.width = inp_sett_cleaner_width.value;     mini_cleaner.style.width = Settings.cleaner.width + 'px'; break;
            case 'height_cleaner': 
                Settings.cleaner.height = inp_sett_cleaner_height.value; 
                mini_cleaner.style.height = Settings.cleaner.height + 'px';
                break;
            case 6: ctx.strokeStyle = arguments[1]; Settings.color = arguments[1];  break;
            case 7: 
                ctx.fillStyle = fill_color_inp.value; 
                Settings.fill_color = fill_color_inp.value;
                change_style(8);
            break;
            case 8:
                if(change_fill.checked){
                    tool.style.backgroundColor = Settings.fill_color;
                }else{
                    tool.style.backgroundColor = "initial";
                }
                Settings.fill = change_fill.checked;
            break;
            default: throw 'ADIO_Error: incorrect argument in "change_style" .'; break;
        }
        
    });
    
    function sweeping(){
        tool.style.border = Settings.sizeLine+'px'+' solid '+Settings.color;
        tool.style.display = "none";
        mini_cleaner.style.display = "none";
    }




    // ! create control
    if(Settings.menu.level !== 'none'){
            
        var menu = document.createElement('div');

        menu.style.padding = '5px';
        menu.style.border = Settings.menu.border;
        menu.style.width = '160px';
        menu.style.position = Settings.menu.position;
        menu.style.backgroundColor = Settings.menu.backgroundColor;
        menu.style.opacity = Settings.menu.opacity;
        menu.style.left = Settings.width + 'px';
        
        
        var sett_cleaner_div = document.createElement('div');
        sett_cleaner_div.id = 'AIDO_setting_cleaner';
        var inp_sett_cleaner_width = document.createElement('input');
        var inp_sett_cleaner_height = document.createElement('input');
        inp_sett_cleaner_width.className = 'AIDO_inputs';
        inp_sett_cleaner_height.className = 'AIDO_inputs';
        inp_sett_cleaner_width.id = 'inp_sett_cleaner_width';
        inp_sett_cleaner_height.id = 'inp_sett_cleaner_height';
        inp_sett_cleaner_width.value = Settings.cleaner.width;
        inp_sett_cleaner_height.value = Settings.cleaner.height;
        var label = document.createElement('label');
        label.className = 'AIDO_labels';
        label.setAttribute('for', 'AIDO_setting_cleaner');
        label.innerHTML = TEXT_setting_cleaner;
        sett_cleaner_div.appendChild(label);
        delete label;
        
        var label = document.createElement('label');
        label.className = 'AIDO_labels';
        label.setAttribute('for', 'inp_sett_cleaner_width');
        label.innerHTML = TEXT_inp_sett_cleaner_width;
        sett_cleaner_div.appendChild(label);
        sett_cleaner_div.appendChild(inp_sett_cleaner_width);
        delete label;
        
        var label = document.createElement('label');
        label.className = 'AIDO_labels';
        label.setAttribute('for', 'inp_sett_cleaner_height');
        label.innerHTML = TEXT_inp_sett_cleaner_height;
        sett_cleaner_div.appendChild(label);
        sett_cleaner_div.appendChild(inp_sett_cleaner_height);
        delete label;

        

        
        
        
        var select_mean = document.createElement('select');
        select_mean.name = 'select_mean';
        select_mean.innerHTML = '\
        <option value = "pen" checked>'+TEXT_pen+'</option>\
        <option value = "pointer">'+TEXT_pointer+'</option>\
        <option value = "rectangle">'+TEXT_rectangle+'</option>\
        <option value = "circle">'+TEXT_circle+'</option>\
        <option value = "cleaner">'+TEXT_cleaner+'</option>\
        ';
        select_mean.onchange = function(){ change_style(4) };
        select_mean.className = 'AIDO_inputs';
        

        
        var inp_size = document.createElement('input');
        var inp_means = document.createElement('input');

        inp_size.id = 'AIDO_inp_size'; 
        inp_means.id = 'AIDO_inp_means';
        inp_means.setAttribute('type', 'hidden');
        inp_size.className = 'AIDO_inputs'; 
        inp_means.className = 'AIDO_inputs';
        inp_size.value = Settings.sizeLine; 
        inp_means.value = Settings.means;
        

        var color_inp = document.createElement('input');
        color_inp.type = "color";
        color_inp.value = Settings.color;
        
        
        var fill_color_inp = document.createElement('input');
        fill_color_inp.type = "color";
        fill_color_inp.value = Settings.fill_color;
        
        var div_inp = document.createElement('div');
        var label = document.createElement('label');
        label.className = 'AIDO_labels';
        label.setAttribute('for', 'AIDO_inp_size');
        label.innerHTML = TEXT_inp_size;
        div_inp.appendChild(label);
        div_inp.appendChild(inp_size);
        menu.appendChild(div_inp);
        delete div_inp;
        delete label;
        
        var div_inp = document.createElement('div');
        var label = document.createElement('label');
        label.className = 'AIDO_labels';
        label.setAttribute('for', 'AIDO_inp_color');
        label.innerHTML = TEXT_inp_color;
        div_inp.appendChild(label);
        div_inp.appendChild(color_inp);
        menu.appendChild(div_inp);
        
        var div_inp = document.createElement('div');
        var label = document.createElement('label');
        label.className = 'AIDO_labels';
        label.setAttribute('for', 'AIDO_inp_color');
        label.innerHTML = TEXT_fill_inp_color;
        
        div_inp.appendChild(label);
        div_inp.appendChild(fill_color_inp);
        menu.appendChild(div_inp);
        delete div_inp;
        delete label;
        
        var change_fill = document.createElement('input');
        change_fill.type = "checkbox";
        
        var div_inp = document.createElement('div');
        var label = document.createElement('label');
        label.className = 'AIDO_labels';
        label.setAttribute('for', 'AIDO_inp_size');
        label.innerHTML = TEXT_change_fill;
        div_inp.appendChild(label);
        div_inp.appendChild(change_fill);
        menu.appendChild(div_inp);
        delete div_inp;
        delete label;
        
        var div_inp = document.createElement('div');
        var label = document.createElement('label');
        label.className = 'AIDO_labels';
        label.setAttribute('for', 'AIDO_inp_means');
        label.innerHTML = TEXT_inp_means;
        div_inp.appendChild(label);
        div_inp.appendChild(inp_means);
        menu.appendChild(div_inp);
        menu.appendChild(select_mean);
        delete div_inp;
        delete label;
        
        menu.appendChild(sett_cleaner_div);
        
        inp_size.oninput = function(){ change_style(1) };
        color_inp.oninput = function(){ change_style(2) };
        fill_color_inp.oninput = function(){ change_style(7) };
        inp_means.oninput = function(){ change_style(3) };
        change_fill.oninput = function(){ change_style(8) };
        
        inp_sett_cleaner_width.oninput = function(){ change_style("width_cleaner") };
        inp_sett_cleaner_height.oninput = function(){ change_style("height_cleaner") };

        
        
        doc.appendChild(menu);
        cbur(menu);
    }

    //control's styles
    var styleSheet = document.createElement('style');
    styleSheet.innerHTML = '\
    .AIDO_inputs{\
        width: 150px; \
        height: 25px;\
        padding: 3px;\
        font-size: 15px;\
        font-family: Arial;\
        border-radius: 5px;\
        border: 1px solid #aaaaaa;\
        margin: 1px 4px;\
        margin-bottom: 10px;\
        transition: border 1s;\
        outline:none;\
    }\
    .AIDO_inputs:hover,focus, active{\
    border: 1px solid #88dd88;\
    }\
    .AIDO_labels{\
        width: 150px; \
        height: 25px;\
        padding: 3px;\
        font-size: 15px;\
        font-family: Arial;\
        margin: 1px 4px;\
        color: '+Settings.menu.color+';\
        cursor:pointer;\
    }';
    
    doc.appendChild(styleSheet);
    
    

}catch(er){
    console.log(er);    
}



// drag'n'drop

function cbur(blok){

    var ie = 0;
    var op = 0;
    var ff = 0;
    var browser = navigator.userAgent;
    
    if(browser.indexOf("Opera") != -1) op = 1;
    else{
        if(browser.indexOf("MSIE") != -1) ie = 1;
        else{
            if(browser.indexOf("Firefox") != -1) ff = 1;
        }
    }
    
    var delta_x = 0;
    var delta_y = 0;
    
    blok.onmousedown = saveXY;

    if(addEventListener){
        blok.addEventListener("onmousedown", saveXY, false);
    }else if(attachEvent){
        blok.attachEvent("mousedown", saveXY);
    }else{
        blok.onmousedown = saveXY;
    }

    var x;
    var y;
    document.onmouseup = clearXY;
    function saveXY(obj_event) {
        if (obj_event) {
        x = obj_event.pageX;
        y = obj_event.pageY;
    }else{
        x = window.event.clientX;
        y = window.event.clientY;
        if (ie) {
            y -= 2;
            x -= 2;
        }
    }
    
    x_blok = blok.offsetLeft;
    y_blok = blok.offsetTop;
    delta_x = x_blok - x;
    delta_y = y_blok - y;
    
    document.onmousemove = moveblok;
    if (op || ff)
        document.addEventListener("onmousemove", moveblok, false);
    }

    function clearXY() {
        document.onmousemove = null; 
    }
    
    function moveblok(obj_event) {
        if (obj_event) {
            x = obj_event.pageX;
            y = obj_event.pageY;
        }else{
            x = window.event.clientX;
            y = window.event.clientY;
            if (ie) {
                y -= 2;
                x -= 2;
            }
        }
        new_x = delta_x + x;
        new_y = delta_y + y;
        blok.style.top = new_y + "px";
        blok.style.left = new_x + "px";
    }

}


});




})();
startCreateDesigner();
