var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Block = function (row, col, state, blockSize) {
    this.row = row;
    this.col = col;
    this.state = state;
    this.size = blockSize;
    this.snake_id = 0;
};

Block.prototype.makeSnake = function(snake_id) {
    // moje bi tuka e proverkata !!!
    this.snake_id = snake_id;
    this.state = 1;
};

Block.prototype.removeSnake = function() {
    // moje bi tuka e proverkata !!!
    this.snake_id = 0;
    this.state = 0;
};

Block.prototype.generateApple = function() {
    this.state = 2;
};

Block.prototype.removeApple = function() {
    this.state = 0;
};


var Map = function (rows, cols, size) {
    var block
        row = 0
        col = 0
        tempArray = []
        board = [];

    for (var i = 1; i <= (rows*cols); i++) {
        block = new Block(row, col, 0, size);
        tempArray.push(block);

        if (i%cols === 0 || i === (rows*cols)) {
            col = 0;
            row++;
            board.push(tempArray);
            tempArray = [];
        }
        else{
            col++;
        }
    };
    this.board = board;
};

Map.prototype.generate = function() {
    return this.board
};

Map.prototype.generateApple = function() {
    var possibleBlocks = this.board.reduce(function(a, b) {
        return a.concat(b);
    });

    var checkForApple = possibleBlocks.filter(function(e){
        if (e.state == 2) {
            return true;
        }
        else{
            return false;
        }
    });

    if (checkForApple.length > 0) return false;

    possibleBlocks = possibleBlocks.filter(function(e){
        if (e.state == 0) {
            return true;
        }
        else{
            return false;
        }
    });

    var changedBlock = possibleBlocks[Math.floor(Math.random()*possibleBlocks.length)];
    changedBlock.generateApple();
    return changedBlock;
};


var Snake = function (snakeNumber, map, headPosition) {
    this.snake_id = snakeNumber;
    this.snakeBlocks = [];
    this.direction;
    this.points = 0;
    this.map = map;
    var currentNode = headPosition
    for (var i = 0; i < 5; i++) {
        this.snakeBlocks.push(currentNode);
        var row = currentNode.row === map.board.length-1 ? 0 : (currentNode.row+1);
        currentNode = map.board[row][currentNode.col];
    };
};

Snake.prototype.generate = function() {
    var snakeNumber = this.snake_id;
    this.snakeBlocks.forEach(function(block){
        block.makeSnake(snakeNumber);
    });
};

Snake.prototype.go = function(direction) {
    console.log(this.snake_id);
    // define required arguments
    var lastBlock = this.snakeBlocks[this.snakeBlocks.length-1],
          copySnake = this.snakeBlocks.slice(0),
          nextBlock;
    var result = {
        "changedBlocks": [],
        "gameResult": 0,
        "points": this.points,
        "snake_id": this.snake_id,
    }

    if(
        (this.direction === 38 && direction === 40) ||
        (this.direction === 40 && direction === 38) ||
        (this.direction === 37 && direction === 39) ||
        (this.direction === 39 && direction === 37))
    {
    }
    else{
        this.direction = direction;
    }

    var block = this.snakeBlocks[0],
        board = this.map.board,
        ROWS = board.length,
        COLS = board[0].length,
        row, col;
    switch(this.direction){
        case 38:
            row = block.row === 0 ? ROWS-1 : (block.row-1);
            nextBlock = board[row][block.col];
            console.log(nextBlock);
            break;
        case 40:
            row = block.row === ROWS-1 ? 0 : (block.row+1);
            nextBlock = board[row][block.col];
            break;
        case 37:
            col = block.col === 0 ? COLS-1 : (block.col-1);
            nextBlock = board[block.row][col];
            break;
        case 39:
            col = block.col === COLS-1 ? 0 : (block.col+1);
            nextBlock = board[block.row][col];
            break;
    }

    if(nextBlock.state === 0 ){
        lastBlock.removeSnake();
        nextBlock.makeSnake(this.snake_id);
        result.changedBlocks.push(lastBlock);
        result.changedBlocks.push(nextBlock);
        this.snakeBlocks[0] = nextBlock;

        for (var i = 1; i < this.snakeBlocks.length; i++) {
            this.snakeBlocks[i] = copySnake[i-1];
            result.changedBlocks.push(this.snakeBlocks[i]);
        }
    }
    else if(nextBlock.state === 1 ){
        result.gameResult = this.snake_id;
    }
    else if(nextBlock.state === 2 ){
        this.points++;
        result.points = this.points;
        this.snakeBlocks.unshift(nextBlock);
        result.changedBlocks.push(nextBlock);
        nextBlock.removeApple();
        nextBlock.makeSnake(this.snake_id);
    }
    return result;
};

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/app/index.html");
})

app.use("/static", express.static(__dirname + "/app/static"));

http.listen(3000, function(){
    console.log("Snake is working");
});


var name = [];
var map, board, snake, snakes = [];
io.on('connection', function (socket) {


    socket.on('joinNewPlayer', function (data) {
        name.push(data.name);
        io.emit("joinedPlayer", {"name": name});
    });

    socket.on('newGame', function (data) {
        map = new Map(data.rows, data.cols, data.size);
        board = map.generate();
        name.forEach(function(e, i){
            snake = new Snake(i, map, board[5][(3+(i*3))]);
            snakes.push(snake);
        });
        snakes.forEach(function(snake){
            snake.generate();
        });
        io.emit('generateMap', { board: board });
    });


    socket.on('newMove', function (data) {
        console.log(snakes);
        console.log(data);
        var result = snakes[data.snake].go(data.command);
        result.changedBlocks.push(map.generateApple());
        io.emit('nextMove', result);
    });

});
