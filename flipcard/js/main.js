var app = new Vue({
    el: '#app',
    data: {
        card: {},
        cards: [],
        current: -1,
        isDefaultFlipped: false,
        currentDictionary: {},
        slideShift: 0,
        dictionaries: [{
            name: "Advanced Words",
            source: "advanced.json",
            code: "advanced"
        }, {
            name: "Main Words",
            source: "main.json",
            code: "main"
        }, {
            name: "From Peak App",
            source: "peak.json",
            code: "peak"
        }]
    },
    methods: {
        flipCard: function (event) {
            this.card.flipped = !this.card.flipped;
            $(event.target).css('transform, rotateY(180deg)');
        },
        showPrevSlide: function () {
            if (this.cards.length == 0) return;
            this.current = (this.current - 1) % this.cards.length;
            var card = this.cards[this.current];
            Vue.set(card, 'flipped', this.isDefaultFlipped)
            this.card = card;
        },
        showNextSlide: function () {
            if (this.cards.length == 0) return;
            this.current = (this.current + 1) % this.cards.length;
            var card = this.cards[this.current];
            Vue.set(card, 'flipped', this.isDefaultFlipped)
            this.card = card;
        },
        loadDictionary: function (dict) {
            this.currentDictionary = dict;
            return $.getJSON('dicts/' + dict.source + '?v=2').done(function (result) {
                this.cards = shuffle(result);
                this.current = -1;
                this.showNextSlide();
                this.$options.sideBar.close();
            }.bind(this));
        },
        shuffle: function () {
            this.loadDictionary(this.currentDictionary).done(function () {
                this.$options.sideBar.close();
            }.bind(this))
        }
    },
    mounted: function () {
        var vm = this;
        this.$options.sideBar = M.Sidenav.init(document.querySelectorAll('.sidenav')[0], {
            edge: "right"
        });

        this.$options.carousel = M.Carousel.init(document.querySelectorAll('.carousel')[0], {
            indicators: false,
            onCycleTo: function () {
                if (vm.slideShift > this.center) {
                    vm.showPrevSlide();
                } else {
                    vm.showNextSlide();
                }
                vm.slideShift = this.center;
            }
        });
    },
    created: function () {
        var dictCode = window.location.hash.substr(3);
        var dict = this.dictionaries.find(function (dct) {
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
