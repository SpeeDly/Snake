function init(board){
    var interval, map, command, snake, name;

    name = $("#id_realname").val();
    snake = $("#connected_players ." + name).data("snake");
    console.log(snake);

    $(".start_game").addClass("hidden");
    $("#snake").removeClass("hidden");

    game = new Game(board);
    game.generate();

    var command = 38;
    $(document).keyup(function(event){
        if (event.which === 38 || event.which === 37 || event.which === 39 || event.which === 40) {
            command = event.which;
            socket.emit('newMove', { command: command, snake: snake });
        };
    })

    socket.on('nextMove', function (data) {
        game.render(data.changedBlocks);
        $(".score .player_" + data.snake_id + " span").text(data.points);
        if(data.gameResult != 0){
            alert("gameOver");
        }
    });


    // socket.on('render', function (data) {
    //     e.render(data.board);
    // });
}
