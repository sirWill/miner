'use strict';

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Mines js class
var Mines = (function(){
  // static data
  var 
    // Объект с параметрами поля
    field = {
      width: 10,
      height: 10,
      cells: [],
    },
    // Массив с минами, каждая мина = значение x,y
    mines = [],
    mines_count = 5;

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
      x,y;
    console.debug('Mines');
    while(mines_count--){
      // генерируем координаты для мины
      do{
        x = getRandom(0, field.width);
        y = getRandom(0, field.height);
      }while(field.cells[y][x].v == -1);
      console.debug(y,x);
      field.cells[y][x].v = -1;
    }
  }

  return {
    init: init
  };

})();  

Mines.init();
