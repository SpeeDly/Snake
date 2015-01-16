function init(board){
    var interval, map, command;
    $(".start_game").addClass("hidden");
    $("#snake").removeClass("hidden");

    game = new Game(board);
    game.generate();

    var command = 38;
    $(document).keyup(function(event){
        if (event.which === 38 || event.which === 37 || event.which === 39 || event.which === 40) {
            command = event.which;        
        };
    })

    while(true){
        socket.emit('newMove', { command: command });
        setTimeout(200);
    }


    socket.on('nextMove', function (data) {
        map.render(data.changedBlocks);
    });


    socket.on('reender', function (data) {
        e.reender(data.board);
    });
}