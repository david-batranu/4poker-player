(function(){
  window.poker = {};

  var COMBO_NAMES = [
    'Nimic',
    'O pereche',
    'Două perechi',
    'Trei',
    'Chintă',
    'Ful',
    'Careu',
    'Culoare',
    'Chintă de culoare'
  ];

  function filterMap(arr, func){
    var retval = [];
    for(var idx=0; idx<arr.length; ++idx){
      var res = func(arr[idx], idx);
      if (res){
        retval.push(res);
      }
    }
    return retval;
  }

  function splitArray(arr, chunksize){
    var result = [];
    for (var i=0, j=arr.length; i<j; i+=chunksize) {
        result.push(arr.slice(i, i + chunksize));
    }
    return result;
  }

  function getFileFromServer(url, doneCallback) {
    var xhr;

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handleStateChange;
    xhr.open("GET", url, true);
    xhr.send();

    function handleStateChange() {
      if (xhr.readyState === 4) {
        doneCallback(xhr.status == 200 ? xhr.responseText : null);
      }
    }
  }

  var Reader = function(path, callback){
    getFileFromServer(path, function(content){
      if (content){
        return callback(content);
      } else {
        alert('Cannot read path');
      }
    });
  };

  var Parser = function(data){
    var split_data = function(data){
      var split = data.split('\n');
      return filterMap(split, function(item){
        return item.split(' ').map(function(i){
          var val = parseInt(i);
          return isNaN(val) ? i : val;
        });
      });
    }(data);
    return {
      stat: split_data[0][0],
      message: split_data[0][0] === 1 ? split_data[1][0] : null,
      score: split_data[1][0],
      combos: function(){
        var result = [];
        var combos = splitArray(split_data[2], 2);
        for (var i=0;i<combos.length; ++i){
          result.push({
            name: COMBO_NAMES[combos[i][0]],
            score: combos[i][1]
          });
        }
        return result;
      }(),
      cards: filterMap(split_data.slice(3), function(card){
        return card[0] === "" ? false : card;
      })
    };
  };

  var Loader = function(cards){
    var card_elems = [];

    function get_svg_path(card){
      return 'svg/' + card.sym + '/' + card.val + '.svg';
    }

    function get_svg_url(card){
      return 'url(' + get_svg_path(card) + ')';
    }

    function create_card(card){
      var elem = document.createElement('DIV');
      elem.dataset.column = 'c' + card.pos;
      elem.className = 'card';
      elem.style.backgroundImage = get_svg_url(card);
      return elem;
    }

    for (var card_idx=0; card_idx<cards.length; card_idx++){
      var card_info = cards[card_idx];
      var card = create_card({
        val: card_info[0],
        sym: card_info[1],
        pos: card_info[2]
      });
      card_elems.push(card);
    }

    return card_elems;
  };

  var Renderer = function(cards){
    return {
      cursor: -1,
      forward: function(){
        if (this.cursor < cards.length - 1){
          this.cursor++;
        }
        var card = cards[this.cursor];
        var target = document.getElementById(card.dataset.column);
        target.appendChild(card);
      },
      back: function(){
        if (this.cursor > -1){
          var card = cards[this.cursor];
          var target = document.getElementById(card.dataset.column);
          target.removeChild(card);
        }

        if (this.cursor > -1){
          this.cursor--;
        }
      },
      render: function(clear){
        for(var i=0; i<cards.length; ++i){
          var card = cards[i];
          var target = document.getElementById(card.dataset.column);
          if (clear){
            target.removeChild(card);
          } else {
            target.appendChild(card);
          }
        }
        if (clear){
          this.cursor = -1;
        } else {
          this.cursor = cards.length - 1;
        }
      },
    };
  };

  var Scoreboard = function(data){
    var stat = document.getElementById('status');
    stat.textContent = data.stat;
    if (data.stat === 0){
      stat.className = 'success';
    } else {
      stat.className = 'fail';
    }

    if (data.stat === 0){
      var success = document.getElementById('success');
      var score = document.getElementById('score');
      var combos = document.getElementById('combos');
      score.textContent = data.score;
      for (var i=0; i<data.combos.length; ++i){
        var combo = data.combos[i];
        var elem = document.createElement('LI');
        elem.textContent = combo.name + ' (' + combo.score + ')';
        combos.appendChild(elem);
      }
      success.className = 'show';
    } else {
      var fail = document.getElementById('fail');
      var message = document.getElementById('message');
      message.textContent = data.message;
      fail.className = 'show';
    }
  };

  function bind_buttons(renderer){
    var start = document.getElementById('btn-start');
    var back = document.getElementById('btn-back');
    var forward = document.getElementById('btn-forward');
    var end = document.getElementById('btn-end');
    var show_hide = document.getElementById('show-hide');

    show_hide.onclick = function(evt){
      var scoreboard = document.getElementById('scoreboard');
      if (evt.target.textContent === 'Show'){
        evt.target.textContent = 'Hide';
        scoreboard.className = 'show';
      } else {
        evt.target.textContent = 'Show';
        scoreboard.className = 'hide';
      }
    };

    start.onclick = function(evt){
      renderer.render(true);
    };

    back.onclick = function(evt){
      renderer.back();
    };

    forward.onclick = function(evt){
      renderer.forward();
    };

    end.onclick = function(evt){
      renderer.render();
    };

    document.onkeydown = function(evt){
      if (evt.keyCode === 72){
        renderer.back();
      } else if (evt.keyCode === 76){
        renderer.forward();
      } else if (evt.keyCode === 74){
        renderer.render();
      } else if (evt.keyCode === 75){
        renderer.render(true);
      }
    };
  }

  var run = function(){
    var gamefile_path = window.location.search.split('?path=')[1];
    Reader(gamefile_path, function(data){
      var parsed_data = Parser(data);
      var cards = Loader(parsed_data.cards);
      var renderer = Renderer(cards);
      Scoreboard(parsed_data);
      bind_buttons(renderer);
    });
  };

  document.addEventListener("DOMContentLoaded", function(event) {
    run();
  });

})();
