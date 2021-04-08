var white_turn = false;
var clicked_counts = 0;
var pre_code = [];
var code = [];
var timesClicked = 0;
var b_right_count = 0;
var b_wrong_count = 0;
var w_right_count = 0;
var w_wrong_count = 0;
var time_limit = true;
var interval;
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function clear_round() {
  clearInterval(interval);
  $("#time").text("00");
  $("#hint1, #hint2, #hint3").attr("disabled", true);
  $("#time_left").slideUp("slow");
}
function startTimer(duration) {
  $("#time").text("30");
  var timer = duration,
    seconds;
  interval = setInterval(function() {
    seconds = parseInt(timer % 60, 10);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    $("#time").text(seconds);
    if (--timer < -1) {
      clear_round();
    }
  }, 1000);
}
function Order(array, order, key) {
  array.sort(function(a, b) {
    var A = a[key],
      B = b[key];
    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
  });
  return array;
}
shuffle(words);
var words_white = words.slice(0, 4);
var words_black = words.slice(4, 8);

$(document).ready(function() {
  $("#show_words").on("click", function() {
    if (clicked_counts === 0) {
      $("#words_div").html(
        "1." +
          words_white[0] +
          " 2." +
          words_white[1] +
          " 3." +
          words_white[2] +
          " 4." +
          words_white[3]
      );
    } else if (clicked_counts === 1) {
      $("#show_words").html("黑隊題目");
    } else if (clicked_counts === 2) {
      $("#words_div").html(
        "1." +
          words_black[0] +
          " 2." +
          words_black[1] +
          " 3." +
          words_black[2] +
          " 4." +
          words_black[3]
      );
    } else if (clicked_counts === 3) {
      $("#show_words").hide();
    }
    clicked_counts++;
    $("#words_div").slideToggle();
  });
  $("#generate_code").on("click", function() {
    timesClicked++;
    if (timesClicked % 2 === 0) {
      $("#code_div").slideUp();
      $(this).attr("disabled", true);
      if (code.length === 0) {
        $("#start").attr("disabled", false);
      }
      timesClicked = 0;
    } else {
      var numbers = [1, 2, 3, 4];
      shuffle(numbers);
      pre_code = numbers;
      $("#code_div").html(pre_code.slice(0, 3));
      $("#code_div").slideDown();
    }
  });
  $("#start").on("click", function() {
    $("input").attr("disabled", false);
    white_turn = !white_turn;
    $("#whose_turn").html(white_turn ? "白隊出題" : "黑隊出題");
    $("#firstGuess").html(white_turn ? "黑" : "白");
    $("#secondGuess").html(white_turn ? "白" : "黑");
    code = pre_code;
    pre_code = [];
    $(this).attr("disabled", true);
    $("#generate_code").attr("disabled", false);
    $("#ok").attr("disabled", false);
    if(time_limit){
      startTimer(29);
      $("#time_left").slideDown("slow");
    }
  });
  $("#ok").on("click", function() {
    //if any cell is empty
    var empty = $(this)
      .parent()
      .find("#first1, #first2, #first3, #second1, #second2, #second3")
      .filter(function() {
        return this.value === "";
      });
    if (empty.length) {
      alert("尚有空格！");
      return false;
    }
    $("input").attr("disabled", true);
    //check if code matches
    if (
      $("#first1").val() == code[0] &&
      $("#first2").val() == code[1] &&
      $("#first3").val() == code[2]
    ) {
      if (white_turn) {
        b_right_count++;
        $("#b_right").html(b_right_count);
        if (b_right_count === 2) {
          alert("黑隊勝利！");
        }
      } else {
        w_right_count++;
        $("#w_right").html(w_right_count);
        if (w_right_count === 2) {
          alert("白隊勝利！");
        }
      }
    }
    if (
      $("#second1").val() != code[0] ||
      $("#second2").val() != code[1] ||
      $("#second3").val() != code[2]
    ) {
      if (white_turn) {
        w_wrong_count++;
        $("#w_wrong").html(w_wrong_count);
        if (w_wrong_count === 2) {
          alert("黑隊勝利！");
        }
      } else {
        b_wrong_count++;
        $("#b_wrong").html(b_wrong_count);
        if (b_wrong_count === 2) {
          alert("白隊勝利");
        }
      }
    }
    //fill in the hints
    var hints = [
      { id: code[0], lable: $("#hint1").val() },
      { id: code[1], lable: $("#hint2").val() },
      { id: code[2], lable: $("#hint3").val() },
      { id: code[3], lable: "" }
    ];
    item_order = [1, 2, 3, 4];
    ordered_array = Order(hints, item_order, "id");
    var color = white_turn ? "white" : "black";
    $("#" + color + "_table tr:last").after(
      "<tr>" +
        "<td>" +
        ordered_array[0].lable +
        "</td>" +
        "<td>" +
        ordered_array[1].lable +
        "</td>" +
        "<td>" +
        ordered_array[2].lable +
        "</td>" +
        "<td>" +
        ordered_array[3].lable +
        "</td>" +
        "</tr>"
    );
    //clear
    $("input").val("");
    code = [];
    if ($("#generate_code").is(":disabled")) {
      $("#start").attr("disabled", false);
    }
    $(this).attr("disabled", true);
    //clear interval if  it's timing
    if(!$("#time_left").is(":hidden")) {
      clear_round();
    };
  });
  $("#time_limit").on("click", function() {
    time_limit = !time_limit;
    time_limit ? $(this).html("限時:開") : $(this).html("限時:關");
  });
});
