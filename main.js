var words = [
  "白膠",
  "塑膠",
  "豎笛",
  "台大",
  "章魚",
  "吉他",
  "醫院",
  "書法",
  "烏龜",
  "骨骼",
  "瘟疫",
  "霍亂",
  "太空",
  "蠟燭",
  "浴室",
  "精油",
  "洞穴",
  "鬼怪",
  "教堂",
  "喇叭",
  "烤箱",
  "神經",
  "肝臟",
  "矯正",
  "蜘蛛",
  "地窖",
  "手槍",
  "光碟",
  "椰子",
  "檔案"
];
var white_turn = false;
var pre_code = [];
var code = [];
var timesClicked = 0;
var b_right_count = 0;
var b_wrong_count = 0;
var w_right_count = 0;
var w_wrong_count = 0;
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
  $("#white_words").on("click", function() {
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
    $("#words_div").toggle();
  });
  $("#black_words").on("click", function() {
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
    $("#words_div").toggle();
  });
  $("#generate_code").on("click", function() {
    timesClicked++;
    if (timesClicked % 2 === 0) {
      $("#code_div").html("");
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
  });
  $("#ok").on("click", function() {
    //if any cell is empty
    var empty = $(this)
      .parent()
      .find("input")
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
  });
});
