function promt(){
    $("#start_new_game").click(function(){
        $("#choise").hide();
        $("#create").removeClass("hidden");
    });

    $("#find_created_game").click(function(){
        $("#choise").hide();
        $("#find").removeClass("hidden");
        socket.emit('getRoomsReq');
    });

    socket.on('getRoomsResp', function(rooms){
        rooms.forEach(function(room){
            $("#rooms").append("<div class='room' data-room=" + room + ">" + room + "</div>")
        });
    });

    $(".room").click(function(){
        $(".room").removeClass("active");
        $(this).addClass("active");
    });

    $("#find #new_game2").click(function(){
        var room = $(".room .active");
        if(room.length === 0){
            socket.emit('joinNewPlayer', {"name": $("#id_name2").val(), "room": room[0]});
            $("#room_name").val(room[0]);
            $("#find").hide();
            $("#wait").removeClass("hidden");
            $("#id_realname").val($("#id_name2").val());
        }
        else{
            alert("Nope");
        }
    });

    var initialData = {};
    $("#create #new_game").click(function(){
        initialData.cols = $("#id_cols").val();
        initialData.rows = $("#id_rows").val();
        initialData.size = $("#id_blocks").val();
        initialData.name = $("#id_name").val();
        initialData.room = $("#id_room").val();

        socket.emit('joinNewPlayer', {"name": initialData.name, "room": initialData.room});
        $("#id_realname").val($("#id_name").val());
        
        $("#room_name").val(initialData.room);
        
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

