'use strict';

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Mines js class
var Mines = (function(){
  // static data
  var 
    // Картинки для вывода клеток поля
    img_closed = document.getElementById('cell_closed_img'),
    img_empty = document.getElementById('cell_empty_img'),
    img_flag = document.getElementById('cell_flag_img'),
    img_mine = document.getElementById('cell_mine_img'),
    img_question = document.getElementById('cell_question_img'),
    // Объект с параметрами поля
    field = {
      width: 10,
      height: 10,
      cells: [],
      cell_size : 20
    },
    // Массив с минами, каждая мина = значение x,y
    mines = [],
    mines_count = 20,
    fieldCanvas = document.getElementById('mines'),
    ctx = fieldCanvas.getContext('2d');

  fieldCanvas.width = field.width * field.cell_size;
  fieldCanvas.height = field.height * field.cell_size;

  ctx.transform(1,0,0,1,0,0);
  ctx.lineCap = 'round';

  function print_field(){
    var i, j, x, y;
    for(i = 0; i<field.height; i++){
      for(j = 0; j < field.width; j++){
        x = field.cell_size * j;
        y = field.cell_size * i;
        if(field.cells[i][j].v == -1){
          ctx.drawImage(img_mine,x,y);
        }else if(field.cells[i][j].v > 0 && field.cells[i][j].v < 9){
          ctx.drawImage(img_question,x,y);
        }else{
          ctx.drawImage(img_closed,x,y);
        }
      }
    }
  }

  function init(){
    // Инициализация поля
    var i, j;
    for(i = 0; i<field.height; i++){
      field.cells.push([]);
      for(j = 0; j < field.width; j++){
        field.cells[i].push({s:0,v:0});
      }
    }
    console.debug(field);
    // расставить мины
    var 
      count = mines_count,
      x,y,ix,jy;
    console.debug('Mines');
    while(mines_count--){
      // генерируем координаты для мины
      do{
        x = getRandom(0, field.width);
        y = getRandom(0, field.height);
      }while(field.cells[y][x].v == -1);
      console.debug(y,x);
      field.cells[y][x].v = -1;
      for(ix=x-1;ix<x+2;ix++){
        for(jy=y-1;jy<y+2;jy++){
          if( ix>-1 && jy>-1 &&
            ix<field.width && jy<field.height &&
            field.cells[jy][ix].v != -1){
              field.cells[jy][ix].v++;
          }
        }
      }
    }
  }

  return {
    init: init,
    print: print_field
  };

})();  

Mines.init();
Mines.print();
