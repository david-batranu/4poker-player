(function(){

  var COMBO_NAMES = [
    'Chintă de culoare',
    'Culoare',
    'Careu',
    'Ful',
    'Chintă',
    'Trei',
    'Două perechi',
    'O pereche',
    'Nimic'
  ];


  var get_data = function(){
    return [
      [0],
      [22],
      [[5, 20], [1, 1], [1, 1], [0, 0]],
      [
        [1, 2, 0],
        [0, 1, 1],
        [2, 1, 2],
        [1, 3, 3]
      ],
      [
        [3, 3, 0],
        [4, 2, 1],
        [0, 3, 2],
        [5, 3, 3]
      ],
      [
        [0, 3, 0],
        [1, 3, 1],
        [2, 3, 2],
        [3, 3, 3]
      ]
    ];
  };

  var get_rows = function(data){
    return data.slice(3);
  };

  var get_svg_path = function(card){
    return 'svg/' + card.sym + '/' + card.val + '.svg';
  };

  var get_svg_url = function(card){
    return 'url(' + get_svg_path(card) + ')';
  };

  var create_card = function(card){
    var elem = document.createElement('DIV');
    elem.className = 'card';
    elem.style.backgroundImage = get_svg_url(card);
    return elem;
  };

  var render_card = function(card){
    var target = document.getElementById('c' + card.pos);
    var html_card = create_card(card);
    target.appendChild(html_card);
  };

  var render_row = function(row){
    for (var i=0; i<row.length; i++){
      var card = row[i];
      render_card({
        val: card[0],
        sym: card[1],
        pos: card[2]
      });
    }
  };

  var render_rows = function(rows){
    for (var row_idx=0; row_idx<rows.length; row_idx++){
      render_row(rows[row_idx]);
    }
  };

  var render = function(){
    var data = get_data();
    var rows = get_rows(data);

    render_rows(rows);
  };


  document.addEventListener("DOMContentLoaded", function(event) {
    render();
  });

})();
