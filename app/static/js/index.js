function promt(){
    $("#start_new_game").click(function(){
        $("#rooms").hide();
        $("#create").removeClass("hidden");
    });

    $("#find_created_game").click(function(){
        $("#rooms").hide();
        $("#find").removeClass("hidden");
    });

    $("#find #new_game2").click(function(){
        socket.emit('joinNewPlayer', {"name": $("#id_name2").val()});
        $("#find").hide();
        $("#wait").removeClass("hidden");
        $("#id_realname").val($("#id_name2").val());
    });

    var initialData = {};
    $("#create #new_game").click(function(){
        initialData.cols = $("#id_cols").val();
        initialData.rows = $("#id_rows").val();
        initialData.size = $("#id_blocks").val();
        initialData.name = $("#id_name").val();
        socket.emit('joinNewPlayer', {"name": initialData.name});
        $("#id_realname").val($("#id_name").val());

        $("#create").hide();
        $("#wait").removeClass("hidden");
        $("#start_real_game").removeClass("hidden");
    });

    $("#wait #start_real_game").click(function(){
        socket.emit('newGame', initialData);
    });
}

promt();

socket.on('generateMap', function (data) {
    $("#wait").hide();
    init(data.board);
});

socket.on('joinedPlayer', function (data) {
    var $container = $("#connected_players");
    $container.html("");

    data.name.forEach(function(name, i){
        $container.append("<div class=" + name + " data-snake=" + i + ">" + name + "</div>");
        $("#snake .score").append("<li class=player_" + i +">" + name + ": <span></span></li>")
    })
});

