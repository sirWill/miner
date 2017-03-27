'use strict';

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Mines js class
var Mines = (function(){
  // static data
  var 
    colors = {
      closed : '#e1e1e1',
      empty : '#cccccc',
      flag : '#005828',
      mine : '#ff2a1a',
      question : '#08afed',
    },
    // Объект с параметрами поля
    field = {
      width: 10,
      height: 10,
      cells: [],
      cell_size : 40
    },
    // Массив с минами, каждая мина = значение x,y
    mines = [],
    mines_count = 7,
    fieldCanvas = document.getElementById('mines'),
    ctx = fieldCanvas.getContext('2d');

  fieldCanvas.width = field.width * field.cell_size;
  fieldCanvas.height = field.height * field.cell_size;

  ctx.transform(1,0,0,1,0,0);
  ctx.lineCap = 'round';

  function print_field(){
    var i, j, x, y;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.font= field.cell_size*.6+"px Verdana";
    ctx.fillStyle = '#ffffff';
    for(i = 0; i<field.height; i++){
      for(j = 0; j < field.width; j++){
        ctx.save();
        x = field.cell_size * j;
        y = field.cell_size * i;
        if(field.cells[i][j].v == -1){
          ctx.fillStyle = colors.mine;
          ctx.fillRect(x,y,x+field.cell_size,y+field.cell_size);
        }else if(field.cells[i][j].v > 0 && field.cells[i][j].v < 9){
          ctx.fillStyle = colors.empty;
          ctx.fillRect(x,y,x+field.cell_size,y+field.cell_size);
          ctx.fillStyle = "#000000";
          ctx.fillText(field.cells[i][j].v, x+field.cell_size*.3, y+field.cell_size*.75)
        }else{
          ctx.fillStyle = colors.empty;
          ctx.fillRect(x,y,x+field.cell_size,y+field.cell_size);
        }
        ctx.rect(x,y,x+field.cell_size,y+field.cell_size);
        ctx.stroke();
        ctx.restore();
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
