var colors = require('colors'); 
var blessed = require('blessed');


function get_random_number(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}
class Field{
    #h;
    #w;
    #m;
    #arr_current; // field
    #arr_old;
    // 1 - alive
    // 0 - dead
    constructor(height, width, max_){
        this.#h = height;
        this.#w = width;
        this.#m = max_;
        this.#arr_current = new Array(height);
        this.#arr_old = new Array(height);
        for (var i=0;i<height;i++){
            this.#arr_current[i] = new Array(width);  
            this.#arr_old[i] = new Array(width);  
        }
        this.mix();
    }
    clear(){
        main_field_box.setContent('');
        screen.render();
    }
    mix(){
        for (var i=0;i<this.#h;i++){
            for (var j=0;j<this.#w;j++){
                this.#arr_current[i][j] = get_random_number(0, this.#m) == 1? 1 : 0;
            }
        }
    }
    print_arr(){
        this.clear();
        for (var i=0;i<this.#h;i++){
            for (var j=0;j<this.#w;j++){
                if (this.#arr_current[i][j] == 1){                   
                    main_field_box.setContent(main_field_box.content + '  '.bgGreen);
                }               
                else{
                    if(typeof this.#arr_old != 'undefined'){
                        if(this.#arr_old[i][j] == 1){
                            main_field_box.setContent(main_field_box.content + '  '.bgRed);
                        }
                        else{
                            main_field_box.setContent(main_field_box.content + '  ');
                        }
                    }
                    else{
                        main_field_box.setContent(main_field_box.content + '  ');
                    } 
                }
            }
            main_field_box.setContent(main_field_box.content + '\n');
        }
        screen.render();
    }
    #check(n, m){
        if (n >= 0 && n < this.#h && m >= 0 && m < this.#w){
            return true;
        }
        return false;
    }
    #define_point(height, width){ 
        var result = 0;

        var height_1 = [height-1, height-1, height-1, height, height+1,height+1,height+1,height];
        var width_1 = [ width-1,  width,    width+1,  width+1,width+1, width,   width-1, width-1];

        for(var i=0; i < 8 && this.#check(height_1[i], width_1[i]); i++){
            result += this.#arr_current[height_1[i]][width_1[i]];
            
        }
        
        if (this.#arr_current[height][width] == 1 && result <= 1){
            return 0;
        }
        else if (this.#arr_current[height][width] == 0 && result == 3){
            return 1;
        }
        else if (this.#arr_current[height][width] == 1 && result >= 4){
            return 0;
        }
        else if (this.#arr_current[height][width] == 1 && (result == 2 || result == 3)){
            return 1;
        }
        else{
            return 0;
        }
        
    }
    #save(){
        for (var i=0;i<this.#h;i++){ 
            for(var j=0;j<this.#w;j++){
                this.#arr_old[i][j] = this.#arr_current[i][j];
            } 
        }
    }
    update_field(){
        this.#save();
        
        var arr_temp =  Object.assign([], this.#arr_current);
        for (var i=0;i<this.#h;i++){
            for (var j=0;j<this.#w;j++){
                arr_temp[i][j] = this.#define_point(i, j);
            }
        }
        this.#arr_current = Object.assign([], arr_temp);
    }   
}

var screen = blessed.screen({
    smartCSR: true
});



var bg_box = blessed.box({
    top: 'center',
    left: 'center',
    width: '120%',
    height: '120%',
    tags: true,
    style: {
        bg: 'blue'
    }
});
var main_field_box = blessed.box({
    top: 'center',
    left: '2%',
    width: '78%',
    height: '95%',
    tags: true,
    style: {
        bg: 'black'
    }
});

var form_1 = blessed.form({
    parent: screen,
    keys: true, 
    top: '5%',
    left: '82%',
    width: '17%',
    height: '95%',
    tags: true,
    style: {
        bg: 'yellow'
    }
});



var button_1 = blessed.button({
    parent: form_1,
    mouse: true,
    keys: true,
    shrink: true,
    top: '5%',
    left: '25%',
    width: '50%',
    height: '10%',
    name: 'cancel',
    tags: true,
    content: 'Заповнити',
    style: {
        bg: 'white',
        fg: 'black',
        focus: {
            bg: 'blue'
          }           
    }    
});
var button_2 = blessed.button({
    top: '20%',
    left: '25%',
    width: '50%',
    height: '10%',
    inputOnFocus: true,
    tags: true,
    content: 'Крок',
    style: {
        bg: 'white',
        fg: 'black',
        focus: {
            bg: 'blue'
          },               
    }
});
var button_3 = blessed.button({
    top: '35%',
    left: '25%',
    width: '50%',
    height: '10%',
    inputOnFocus: true,
    tags: true,
    content: 'Очистити',
    style: {
        bg: 'white',
        fg: 'black',
        focus: {
            bg: 'blue'
          },               
    }
});
var button_4 = blessed.button({
    top: '50%',
    left: '25%',
    width: '50%',
    height: '10%',
    inputOnFocus: true,
    tags: true,
    content: 'Вийти',
    style: {
        bg: 'white',
        fg: 'black',
        focus: {
            bg: 'blue'
          },               
    }
});



screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

button_1.on('press', function() {//fill
    A = new Field(  parseInt(main_field_box.height), 
                    parseInt(main_field_box.width/2), 
                    3
                    );
    A.print_arr();
});
button_2.on('press', function() {//step
    A.update_field();
    A.print_arr();
});
button_3.on('press', function() {//delete
    A = new Field(0,0,0);
    A.clear();
});
button_4.on('press', function() {//exit
    return process.exit(0);
});






screen.append(bg_box);
screen.append(main_field_box);
screen.append(form_1);

form_1.append(button_1);
form_1.append(button_2);
form_1.append(button_3);
form_1.append(button_4);




screen.title = 'Гра <<Життя>>';
var A = new Field(0,0,0);

screen.render();