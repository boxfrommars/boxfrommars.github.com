var app = new Vue({
  el: '#app',
  data: {
    card: {},
    cards: [],
    current: -1,
    isDefaultFlipped: false,
    currentDictionary: {},
    dictionaries: [{
      name: "Advanced Words",
      source: "advanced.json",
      code: "advanced"
    }, {
      name: "Main Words",
      source: "main.json",
      code: "main"
    }]
  },
  methods: {
    flipCard: function(event) {
      this.card.flipped = !this.card.flipped;
      $(event.target).css('transform, rotateY(180deg)');
    },

    showNextSlide: function() {
      if (this.cards.length == 0) return;

      this.current = (this.current + 1) % this.cards.length;
      var card = this.cards[this.current];
      card.flipped = this.isDefaultFlipped;
      this.card = card;
    },

    loadDictionary: function(dict) {
      this.currentDictionary = dict;
      return $.getJSON('dicts/' + dict.source).done(function(result) {
        this.cards = shuffle(result);
        this.current = -1;
        this.showNextSlide();

        this.$options.sideBar.close();
      }.bind(this));
    }
  },
  mounted: function() {
    var vm = this;

    this.$options.sideBar = M.Sidenav.init(
      document.querySelectorAll('.sidenav'), {
        edge: "right"
      }
    )[0];

    $('.carousel.carousel-slider').carousel({
      fullWidth: true,
      indicators: false,
      dist: 0,
      onCycleTo: function() {
        vm.showNextSlide();
      }
    });
  },
  created: function() {
    var dictCode = window.location.hash.substr(3);

    var dict = this.dictionaries.find(function(dct) {
      return dct.code == dictCode;
    });

    if (!dict) {
        dict = this.dictionaries[0];
    }

    this.loadDictionary(dict);
  }
})


function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
