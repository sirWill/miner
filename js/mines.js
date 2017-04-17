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
      hover : '#919191',
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
      cell_size : 40,
      opened: 0
    },

    timer = {
      start : null,
      interval : null
    },

    // Массив с минами, каждая мина = значение x,y
    mines = [],
    mines_count = 7,
    startGame = document.getElementById('startGame'),
    fieldCanvas = document.getElementById('mines'),
    ctx = fieldCanvas.getContext('2d'),
    gameOver = false,

    buffer = {
      field: null,
    },
    // Элементы интерфейса
    gameTimer  = document.getElementById('gameTimer'),
    minesCount = document.getElementById('minesCount'),
    fieldSquare = document.getElementById('fieldSquare'),
    fieldOpened = document.getElementById('fieldOpened');

  fieldCanvas.width = field.width * field.cell_size;
  fieldCanvas.height = field.height * field.cell_size;

  ctx.transform(1,0,0,1,0,0);
  ctx.lineCap = 'round';

  // Обработка событий мыши
  fieldCanvas.addEventListener('mousemove', function(e){
    ctx.putImageData(buffer.field,0,0);
    var cell = {
      x : parseInt(e.x/field.cell_size),
      y : parseInt(e.y/field.cell_size)
    };
    // console.debug(e.x, e.y, ' => ', cell.y, cell.x);
    ctx.save();
    ctx.fillStyle = colors.hover;
    var 
      x = cell.x * field.cell_size,
      y = cell.y * field.cell_size;
    ctx.fillRect(x,y,field.cell_size,field.cell_size);
    ctx.rect(x,y,field.cell_size,field.cell_size);
    ctx.stroke();
    ctx.restore();
  });

  fieldCanvas.addEventListener('click', function(e){
    e.preventDefault();
    if(gameOver) return;
    var
      cell = {
        x : parseInt(e.x/field.cell_size),
        y : parseInt(e.y/field.cell_size),
      };
    field.cells[cell.y][cell.x].s = 1;
    // TODO: Обработка клика правой кнопкой мыши
    
    // если попали на мину
    if(field.cells[cell.y][cell.x].v == -1){
      gameOver = true;
      window.alert('GAME OVER!');
      clearInterval(timer.interval);
      // TODO: Выводить надпись Game Over поверх игрового поля.
    }

    // Обход соседних ячеек
    // Открывать все пустые соседние клетки
    // Реализуем обход ячеек через очередь и стек.
    // Добавляем в очередь текущую ячейку
    // Пока в очереди есть ячейки:
    //  Смотрим ячейку сверху
    //    Если ячейка закрыта, то 
    //      Если в ней больше 0 — открываем ячейку
    //      Если в ней 0 — добавляем ее в очередь и открываем
    //  Смотрим ячейку снизу
    //    Аналогично
    //  Смотрим ячейку справа
    //    Аналогично
    //  Смотрим ячейку слева
    //    Аналогично
    
    // TODO: На пятерку: обход смерти на первом ходу
    // Считаем открытие клетки
    field.opened++;
    fieldOpened.textContent = field.opened;
    update_field();
  });

  startGame.addEventListener('click', function(e){
    e.preventDefault();
    init();
    print_field();
  });

  // TODO: Оптимизировать до перерисовывания только одной ячейки.
  // Отрисовываем все поле в соответствии со статусом клеток
  function update_field(){
    var i, j, x, y;
    for(i = 0; i<field.height; i++){
      for(j = 0; j < field.width; j++){
        ctx.save();
        x = field.cell_size * j;
        y = field.cell_size * i;
        if(field.cells[i][j].s){
          switch(field.cells[i][j].v){
            case -1: 
              // Рисуем мину
              ctx.fillStyle = colors.mine;
              ctx.fillRect(x,y,field.cell_size,field.cell_size);
              break;
            case 0:
              // Рисуем пустую клетку
              ctx.fillStyle = colors.empty;
              ctx.fillRect(x,y,field.cell_size,field.cell_size);
              break;
            default:
              // Рисуем цифру
              ctx.fillStyle = colors.empty;
              ctx.fillRect(x,y,field.cell_size,field.cell_size);
              ctx.fillStyle = "#000000";
              ctx.fillText(field.cells[i][j].v, x+field.cell_size*.3, y+field.cell_size*.75)
          }
        }else{
          // Рисуем неоткрытую клетку
          ctx.fillStyle = colors.closed;
          ctx.fillRect(x,y,field.cell_size,field.cell_size);
        }
        ctx.rect(x,y,field.cell_size,field.cell_size);
        ctx.stroke();
        ctx.restore();
      }
    }
    buffer.field = ctx.getImageData(0,0,fieldCanvas.width,fieldCanvas.height);
  }

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
        ctx.fillStyle = colors.closed;
        ctx.fillRect(x,y,field.cell_size,field.cell_size);
        ctx.rect(x,y,field.cell_size,field.cell_size);
        ctx.stroke();
        ctx.restore();
      }
    }
    fieldSquare.textContent = field.width * field.height;
    fieldOpened.textContent = field.opened;
    buffer.field = ctx.getImageData(0,0,fieldCanvas.width,fieldCanvas.height);
  }

  function init(){
    // Обнуление переменных к начальному состоянию
    field = {
      width: 10,
      height: 10,
      cells: [],
      cell_size : 40,
      opened: 0
    };
    if(timer.interval){
      clearInterval(timer.interval);
    }
    mines = [];
    gameOver = false;
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
    while(count--){
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
    timer.start = moment();
    timer.interval = setInterval(function(){
      gameTimer.textContent = moment(moment().diff(timer.start)).format('mm:ss');
    }, 1000);
  }

  return {
    init: init,
    print: print_field
  };

})();

Mines.init();
Mines.print();
