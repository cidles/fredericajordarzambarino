var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        reset_values();
        loadjson();
    },
    receivedEvent: function(id) {
        //console.log('Received Event: ' + id);
    }
};

var current_question_number = 0;
var money_won = "0 Montantes";
var perguntas_usadas = [0];
var json = [];
var randomnumber = 0;
var answered =  false;

function reset_values() {
    current_question_number = 0;
    money_won = "0 Montantes";
    perguntas_usadas = [0];
    andomnumber = 0;
    answered =  false;

}

function loadjson() {
    json = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'perguntas.json',
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })(); 
}

function start_new_game() {
    $("#start").css( "display", "none" );

    //Clear money colors
    for (var i = 1; i <= 15; i++) { 
        $("#money" + i).css("color", "black");
    }

    //Clear ajudas
    $("#call").prop('disabled', false);
    $("#publico").prop('disabled', false);
    $("#fiftyfifty").prop('disabled', false);

    next_question();
}

function next_question() {
    answered = false;

    $("#game").css( "display", "none" );
    if (current_question_number != 0) {
        $("#money" + current_question_number).css("color", "green");
        //Update money won
        money_won = $("#money" + current_question_number + " .col-xs-9").html();
    }
    current_question_number++;
    $("#money" + current_question_number).css("color", "orange");
    $("#money").css( "display", "inline" );

    if (current_question_number > 15) {
        winner();
        return;
    }
    setTimeout(function() {back_to_game()}, 2800);

    //Clear answers
    for (var i = 1; i <= 4; i++) {
        $("#answer" + i).html("");
        $("#answer" + i).prop('disabled', true);
        $("#answer" + i).addClass('btn-warning')
                        .removeClass('btn-info')
                        .removeClass('btn-success')
                        .removeClass('btn-danger'); 
    };

    //load question
    randomnumber = Math.floor(Math.random()*(json.length))
    while ($.inArray(randomnumber, perguntas_usadas) != -1) {
        randomnumber = Math.floor(Math.random()*(json.length))
    }

    perguntas_usadas.push(randomnumber); 

    if (json[randomnumber][4] != "") {
        $("#picture").attr("src", "img/" + json[randomnumber][4]);
    }
    else $("#picture").attr("src", "img/question_mark.png");

    $("#question").html(json[randomnumber][1]);

    for (var i = 1; i <= json[randomnumber][2].length; i++) { 
        $("#answer" + i).html(json[randomnumber][2][i - 1]);
        $("#answer" + i).prop('disabled', false);
    };
}

function responder(resposta_n) {
    if (!answered){
        answered = true;

        $("#answer" + resposta_n).addClass('btn-info').removeClass('btn-warning');
        if (resposta_n ==  json[randomnumber][3]) {
            setTimeout(function() {
                $("#answer" + resposta_n).addClass('btn-success').removeClass('btn-info');
            }, 1500);
            setTimeout(function() {next_question()}, 3000);
        }
        else {
            setTimeout(function() {
                $("#answer" + resposta_n).addClass('btn-danger').removeClass('btn-info');
            }, 1500);
            setTimeout(function() {
                $("#answer" + json[randomnumber][3]).addClass('btn-success').removeClass('btn-warning');
            }, 1500);
            setTimeout(function() {game_over()}, 5500);
        }
    }
}

function back_to_game() {
    $("#money").css( "display", "none" );
    $("#game").css( "display", "inline" );
}

function home() {
    reset_values();
    $("#money").css( "display", "none" );
    $("#game").css( "display", "none" );
    $("#game_over").css( "display", "none" );
    $("#winner").css( "display", "none" );
    $("#start").css( "display", "inline" );
}

function game_over() {
    $("#money_won").html(money_won);
    reset_values();
    $("#money").css( "display", "none" );
    $("#game").css( "display", "none" );
    $("#start").css( "display", "none" );
    $("#game_over").css( "display", "inline" );
}

function winner() {
    reset_values();
    $("#money").css( "display", "none" );
    $("#game").css( "display", "none" );
    $("#start").css( "display", "none" );
    $("#game_over").css( "display", "none" );
    $("#winner").css( "display", "inline" );
}

function continue_from_help() {
    $("#call_div").css( "display", "none" );
    $("#publico_div").css( "display", "none" );
    $("#game").css( "display", "inline" );
}

function call(){
    $("#call").prop('disabled', true);
    $("#call_answer").html(json[randomnumber][3] + 'ª, "' + json[randomnumber][2][ json[randomnumber][3]-1 ] + '".');
    $("#game").css( "display", "none" );
    $("#call_div").css( "display", "inline" );
}

function publico(){
	$("#publico").prop('disabled', true);
	if (json[randomnumber][3] == 1) {
		$("#publico_1").attr("aria-valuenow", "45")
		$("#publico_2").attr("aria-valuenow", "10")
		$("#publico_3").attr("aria-valuenow", "25")
		$("#publico_4").attr("aria-valuenow", "20")
		$("#publico_1").css("width", "45%")
		$("#publico_2").css("width", "10%")
		$("#publico_3").css("width", "25%")
		$("#publico_4").css("width", "20%")
	}

	else if (json[randomnumber][3] == 2) {
		$("#publico_1").attr("aria-valuenow", "10")
		$("#publico_2").attr("aria-valuenow", "45")
		$("#publico_3").attr("aria-valuenow", "25")
		$("#publico_4").attr("aria-valuenow", "20")
		$("#publico_1").css("width", "10%")
		$("#publico_2").css("width", "45%")
		$("#publico_3").css("width", "25%")
		$("#publico_4").css("width", "20%")
	}
	
	else if (json[randomnumber][3] == 3) {
		$("#publico_1").attr("aria-valuenow", "25")
		$("#publico_2").attr("aria-valuenow", "20")
		$("#publico_3").attr("aria-valuenow", "45")
		$("#publico_4").attr("aria-valuenow", "10")
		$("#publico_1").css("width", "25%")
		$("#publico_2").css("width", "20%")
		$("#publico_3").css("width", "45%")
		$("#publico_4").css("width", "10%")
	}

	else if (json[randomnumber][3] == 4) {
		$("#publico_1").attr("aria-valuenow", "20")
		$("#publico_2").attr("aria-valuenow", "25")
		$("#publico_3").attr("aria-valuenow", "10")
		$("#publico_4").attr("aria-valuenow", "45")
		$("#publico_1").css("width", "20%")
		$("#publico_2").css("width", "25%")
		$("#publico_3").css("width", "10%")
		$("#publico_4").css("width", "45%")
	}

    $("#publico_resposta_1").html(json[randomnumber][2][0]);
    $("#publico_resposta_2").html(json[randomnumber][2][1]);
    $("#publico_resposta_3").html(json[randomnumber][2][2]);
    $("#publico_resposta_4").html(json[randomnumber][2][3]);

	$("#game").css( "display", "none" );
    $("#publico_div").css( "display", "inline" );
}

function fiftyfifty(){
    removed = 1;
    toremove = 0;

    if (json[randomnumber][2].length <= 3) {
        toremove = 1;
    }
    else {
        toremove = 2;
    }
    for (i = 1; i <= 4; i++) {
        if (i != json[randomnumber][3] && removed <= toremove) {
            $("#answer" + i).prop('disabled', true);
            removed++;
        }
    }
    $("#fiftyfifty").prop('disabled', true);
}