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


  var get_data = function(){
    return [
      [0],
      [22],
      [[5, 20], [1, 1], [1, 1], [0, 0]],
      [1, 2, 0],
      [0, 1, 1],
      [2, 1, 2],
      [1, 3, 3],
      [3, 3, 0],
      [4, 2, 1],
      [0, 3, 2],
      [5, 3, 3],
      [0, 3, 0],
      [1, 3, 1],
      [2, 3, 2],
      [3, 3, 3]
    ];
  };

  var Reader = function(){
      return get_data();
  };

  var Parser = function(data){
    return {
      stat: data[0][0],
      message: data[0][0] === 1 ? data[1][0] : null,
      score: data[1][0],
      combos: function(){
        var result = [];
        for (var i=0;i<data[2].length; ++i){
          result.push({
            name: COMBO_NAMES[data[2][i][0]],
            score: data[2][i][1]
          });
        }
        return result;
      }(),
      cards: data.slice(3)
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

  function bind_buttons(renderer){
    var start = document.getElementById('btn-start');
    var back = document.getElementById('btn-back');
    var forward = document.getElementById('btn-forward');
    var end = document.getElementById('btn-end');

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
    var data = Reader();
    var parsed_data = Parser(data);
    var cards = Loader(parsed_data.cards);
    window.poker.renderer = Renderer(cards);
    var renderer = window.poker.renderer;
    bind_buttons(renderer);
  };

  document.addEventListener("DOMContentLoaded", function(event) {
    run();
  });

})();
