function promt(){
    var initialData = {};
    $("#new_game").click(function(){
        initialData.cols = $("#id_cols").val();
        initialData.rows = $("#id_rows").val();
        initialData.size = $("#id_blocks").val();
        socket.emit('newGame', { initialData: initialData });
    });
}

promt();

socket.on('generatedMap', function (data) {
    init(data.board);
});