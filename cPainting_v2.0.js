/*!
 * cPaiтting JavaScript Modul v1.5
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

// object cPainting_settings
var cPainting_settings = {
        
    width: 500,                  //width canvas
    height: 500,                 //height
    bg: '#ffffff',               //background-color
    opacity: 1,                  //
    menu: {                      //control 
        level: 'pro',            //level control: none, less, pro
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
    color: 'rgba(50,50,150,0.9)',//color tool
    sizeLine: 10,                 //size tool (px)
    standart_colors: ['#ff0000', '#00ff00', '#0000ff', '#ffa500', '#a5ff00', '#00a5ff', '#ff00a5', '#000000', '#ffffff'], //standart colors for less level control
    ln: 'en'

}


// language settings, default:ru

switch(cPainting_settings.ln){
    
    case 'en':    
        var TEXT_inp_size = 'size (px)',
        TEXT_inp_color = 'color',
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
        TEXT_inp_color = 'цвет',
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

    canvas.setAttribute('width', cPainting_settings.width + 'px');
    canvas.setAttribute('height', cPainting_settings.height + 'px');

    canvas.style.position = 'absolute';
    canvas.style.backgroundColor = cPainting_settings.bg;
    canvas.style.border = '1px solid #000';
    canvas.id = 'CanvasDrawerADIO1';
    doc.appendChild(canvas);


    var ctx = canvas.getContext('2d');

    // summ all margins
    var elem = canvas;
        
    var top=0, left=0;
        
    while(elem) {
        top = top + parseFloat(elem.offsetTop)
        left = left + parseFloat(elem.offsetLeft)
        elem = elem.offsetParent        
    }

    var mini_cleaner = document.createElement('div');
    mini_cleaner.style.position = 'absolute';
    mini_cleaner.style.display = 'none';
    mini_cleaner.style.border = '1px solid #555';
    mini_cleaner.style.backgroundColor = '#fff';
    mini_cleaner.style.zIndex = 1000;
    mini_cleaner.style.pointerEvents = "none";
    doc.appendChild(mini_cleaner);
    
    var tool = document.createElement('div');
    tool.id = "CanvasDrawerADIO_tool";
    tool.down = false;
    tool.width = '0px';
    tool.height = '0px';
    tool.style.position = 'absolute';
    tool.style.zIndex = 1000;
    tool.style.pointerEvents = "none";
    doc.appendChild(tool);
    
    
    
    // events definition

    canvas.onmousedown = function(e){
        
        paint = true;

        if(cPainting_settings.using_tool.rectangle == true && tool.down != true){
            tool.style.left = e.pageX - 2*cPainting_settings.sizeLine - parseInt(tool.style.width);
            tool.style.top = e.pageY - 2*cPainting_settings.sizeLine - parseInt(tool.style.height);
            tool.down = true;
            return;
        }else{
            if(cPainting_settings.using_tool.circle == true && tool.down != true){
            tool.style.left = e.pageX - 2*cPainting_settings.sizeLine - parseInt(tool.style.width);
            tool.style.top = e.pageY - 2*cPainting_settings.sizeLine - parseInt(tool.style.height);
            tool.down = true;
            return;
            }else{

                addClick(e.pageX - left, e.pageY - top);
                redraw();
            }
        
        }
        
    };


    canvas.onmousemove = function(e){    

        if(cPainting_settings.using_tool.rectangle == true && tool.down == false){
            tool.style.left = e.pageX - 2*cPainting_settings.sizeLine - 3;
            tool.style.top = e.pageY - 2*cPainting_settings.sizeLine - 3;
            return;
        }
        
        if(cPainting_settings.using_tool.rectangle == true && tool.down == true){
            tool.style.width = Math.abs(e.pageX - parseInt(tool.style.left) - 2*cPainting_settings.sizeLine) - 3;
            tool.style.height = Math.abs(e.pageY - parseInt(tool.style.top) - 2*cPainting_settings.sizeLine) - 3;
            return;
        }
        
        
        
        
        if(cPainting_settings.using_tool.circle == true && tool.down == false){
            tool.style.left = e.pageX - 2*cPainting_settings.sizeLine - 3;
            tool.style.top = e.pageY - 2*cPainting_settings.sizeLine - 3;
            return;
        }
        
        if(cPainting_settings.using_tool.circle == true && tool.down == true){
            tool.style.width = Math.abs(e.pageX - parseInt(tool.style.left) - 2*cPainting_settings.sizeLine) - 3;
            tool.style.height =  Math.abs(e.pageX - parseInt(tool.style.left) - 2*cPainting_settings.sizeLine) - 3;
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

        if(cPainting_settings.using_tool.rectangle == true && tool.down != false){
            tool.down = false;
            
                ctx.strokeStyle = cPainting_settings.color;
                ctx.lineJoin = 'round';
                ctx.lineCup = 'none';
                ctx.lineWidth = cPainting_settings.sizeLine;
                ctx.beginPath();
                ctx.rect(parseInt(tool.style.left) - left, parseInt(tool.style.top) - top, parseInt(tool.style.width) + cPainting_settings.sizeLine/2, parseInt(tool.style.height) + cPainting_settings.sizeLine/2);
                ctx.closePath();
                ctx.stroke();
            
            cPainting_settings.using_tool.rectangle = false;
            tool.style.width = "0px";
            tool.style.height = "0px";
            tool.style.display = "none";
            clickX = [];
            clickY = [];
            clickclickDrag = [];
            return;
        }
        
        
        
        
        if(cPainting_settings.using_tool.circle == true && tool.down != false){
            tool.down = false;
            
                ctx.strokeStyle = cPainting_settings.color;
                ctx.lineJoin = 'round';
                ctx.lineCup = 'none';
                ctx.lineWidth = cPainting_settings.sizeLine;
                ctx.beginPath();
                ctx.arc(parseInt(tool.style.left)+parseInt(tool.style.width)/2 - left, parseInt(tool.style.top)+parseInt(tool.style.width)/2 - top, parseInt(tool.style.width)/2 + cPainting_settings.sizeLine/2, 0, 2*Math.PI, true);
                ctx.closePath();
                ctx.stroke();
            
            cPainting_settings.using_tool.circle = false;
            tool.style.width = "0px";
            tool.style.height = "0px";
            tool.style.display = "none";
            clickX = [];
            clickY = [];
            clickclickDrag = [];
            return;
        }

        if((cPainting_settings.means == 'pen') || (cPainting_settings.means == 'cleaner')){ //
            clickX = [];
            clickY = [];
            clickclickDrag = [];
        }
        

        
        
    };



    canvas.onmouseleave = function(e){
        paint = false;

        if(cPainting_settings.using_tool.rectangle == true && tool.down != false){
            tool.down = false;
            return;
        }
        if(cPainting_settings.using_tool.circle == true && tool.down != false){
            tool.down = false;
            return;
        }
        
        if((cPainting_settings.means == 'pen') || (cPainting_settings.means == 'cleaner')){ //clear x y
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
    
    ctx.strokeStyle = cPainting_settings.color;
    ctx.lineJoin = 'round';
    ctx.lineCup = 'round';
    ctx.lineWidth = cPainting_settings.sizeLine;
    
    if(cPainting_settings.cleaner.act == false){
        mini_cleaner.style.display=  "none";
    }
    
    
    
    // draw current map
    
    function redraw(){
            
        switch(cPainting_settings.means){
        case 'pen':

            cPainting_settings.using_tool.rectangle = false;

            cPainting_settings.cleaner.act = false;
        
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
            
            cPainting_settings.using_tool.rectangle = false;
            
            cPainting_settings.cleaner.act = false;        

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
        
        if(cPainting_settings.using_tool.rectangle != true) {
            cPainting_settings.using_tool.rectangle = true;
        }
        
        tool.style.border = cPainting_settings.sizeLine+'px'+' solid '+cPainting_settings.color;
        tool.style.borderRadius = '5px';
        tool.style.display = 'block';
        
        
        
        
        break;
        
        case 'circle':

        if(cPainting_settings.using_tool.circle != true) {
            cPainting_settings.using_tool.circle = true;
        }
        
        tool.style.border = cPainting_settings.sizeLine+'px'+' solid '+cPainting_settings.color;
        tool.style.borderRadius = '100%';
        tool.style.display = 'block';        
    
        break;
        
        
        
        case 'cleaner':
            
            cPainting_settings.cleaner.act = true;
            
            mini_cleaner.style.width = cPainting_settings.cleaner.width + 'px';
            mini_cleaner.style.height = cPainting_settings.cleaner.height + 'px';
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


    
    
    change_style = (function(n){
        switch(n){
            case 1: 
                ctx.lineWidth = inp_size.value; cPainting_settings.sizeLine = inp_size.value; 
                tool.style.border = cPainting_settings.sizeLine+'px'+' solid '+cPainting_settings.color; 
            break;
            
            case 2: 
                ctx.strokeStyle = inp_color.value; cPainting_settings.color = inp_color.value; value_color.style.backgroundColor = inp_color.value; 
                tool.style.border = cPainting_settings.sizeLine+'px'+' solid '+cPainting_settings.color;
            break;
            
            case 3: cPainting_settings.means = inp_means.value;  break;
            case 4: sweeping(); cPainting_settings.means = select_mean.value; inp_means.value = select_mean.value; redraw(); break;
            case 'width_cleaner': 
                cPainting_settings.cleaner.width = inp_sett_cleaner_width.value;     mini_cleaner.style.width = cPainting_settings.cleaner.width + 'px'; break;
            case 'height_cleaner': 
                cPainting_settings.cleaner.height = inp_sett_cleaner_height.value; 
                mini_cleaner.style.height = cPainting_settings.cleaner.height + 'px';
                break;
            case 6: ctx.strokeStyle = arguments[1]; cPainting_settings.color = arguments[1];  break;
            default: throw 'ADIO_Error: incorrect argument in "change_style" .'; break;
        }
        
    });
    
    function sweeping(){
        tool.style.border = cPainting_settings.sizeLine+'px'+' solid '+cPainting_settings.color;
        tool.style.display = "none";
        mini_cleaner.style.display = "none";
    }




    // ! create control
    if(cPainting_settings.menu.level !== 'none'){
            
        var menu = document.createElement('div');

        menu.style.padding = '5px';
        menu.style.border = cPainting_settings.menu.border;
        menu.style.width = '160px';
        menu.style.position = cPainting_settings.menu.position;
        menu.style.backgroundColor = cPainting_settings.menu.backgroundColor;
        menu.style.opacity = cPainting_settings.menu.opacity;
        menu.style.left = cPainting_settings.width + 'px';
        menu.id = 'ADIO_Menu';
        
        
        var sett_cleaner_div = document.createElement('div');
        sett_cleaner_div.id = 'AIDO_setting_cleaner';
        var inp_sett_cleaner_width = document.createElement('input');
        var inp_sett_cleaner_height = document.createElement('input');
        inp_sett_cleaner_width.className = 'AIDO_inputs';
        inp_sett_cleaner_height.className = 'AIDO_inputs';
        inp_sett_cleaner_width.id = 'inp_sett_cleaner_width';
        inp_sett_cleaner_height.id = 'inp_sett_cleaner_height';
        inp_sett_cleaner_width.value = cPainting_settings.cleaner.width;
        inp_sett_cleaner_height.value = cPainting_settings.cleaner.height;
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
        select_mean.setAttribute('onchange', 'change_style(4)');
        select_mean.className = 'AIDO_inputs';
        

        
        var inp_size = document.createElement('input');
        var inp_color = document.createElement('input');
        var inp_means = document.createElement('input');

        inp_size.id = 'AIDO_inp_size'; 
        inp_color.id = 'AIDO_inp_color'; 
        inp_means.id = 'AIDO_inp_means';
        inp_means.setAttribute('type', 'hidden');
        inp_size.className = 'AIDO_inputs'; 
        inp_color.className = 'AIDO_inputs'; 
        inp_means.className = 'AIDO_inputs';
        inp_size.value = cPainting_settings.sizeLine; 
        inp_color.value = cPainting_settings.color; 
        inp_means.value = cPainting_settings.means;
        

        

        
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
        (cPainting_settings.menu.level == 'pro')?div_inp.appendChild(inp_color): undefined;
        menu.appendChild(div_inp);
        delete div_inp;
        delete label;
        
        if(cPainting_settings.menu.level == 'pro'){
            var value_color = document.createElement('div');
            value_color.style.width = '150px';
            value_color.style.height = '20px';
            value_color.style.margin = '5px';
            value_color.style.backgroundColor = cPainting_settings.color;
            menu.appendChild(value_color);
        }else{
            var div_value_color = document.createElement('div');
            
            for(let i = 0; i < cPainting_settings.standart_colors.length; i++){
            
            var rect_value_color = document.createElement('div');
            rect_value_color.style.width = '15px';
            rect_value_color.style.height = '15px';
            rect_value_color.style.margin = '5px';
            rect_value_color.style.border = '1px solid #cccccc';
            rect_value_color.style.cursor = 'pointer';
            rect_value_color.style.float = 'left';
            rect_value_color.style.backgroundColor = cPainting_settings.standart_colors[i];
            rect_value_color.setAttribute('onclick', 'change_style(6, "'+cPainting_settings.standart_colors[i]+'")')
            div_value_color.appendChild(rect_value_color);
            delete rect_value_color;
            }
            div_value_color.innerHTML += '<div style="clear:both"> </div>';
            menu.appendChild(div_value_color);
        }
        
        
        
        
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
        
        
        inp_size.setAttribute('oninput', 'change_style(1)');
        inp_color.setAttribute('oninput', 'change_style(2)');
        // inp_color.setAttribute('onkeyup', 'change_style(2)');
        inp_means.setAttribute('oninput', 'change_style(3)');
        
        inp_sett_cleaner_width.setAttribute('oninput', 'change_style("width_cleaner")');
        inp_sett_cleaner_height.setAttribute('oninput', 'change_style("height_cleaner")');

        
        
        doc.appendChild(menu);
        cbur(menu.id);
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
        color: '+cPainting_settings.menu.color+';\
        cursor:pointer;\
    }';
    doc.appendChild(styleSheet);
        


    

}catch(er){
    console.log(er);    
}



// drag'n'drop

function cbur(n){

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
    
    if(document.getElementById){
        var blok = document.getElementById(n);
    }else{
        var blok = document.all[n];  
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
