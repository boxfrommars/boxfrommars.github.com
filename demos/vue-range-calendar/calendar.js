Vue.config.debug = true;

moment.locale('ru');

var locale = {
  quarter: {
    ru: 'квартал',
    en: 'quarter'
  }
};

var _t = function (name) {
  return locale[name][moment.locale()];
};

var generateQuarters = function (year) {
  return [1, 2, 3, 4].map(function (quarterNum) {
    var quarter = moment().year(year).quarter(quarterNum);

    return {
      title: year + '/Q' + quarterNum, // + ' ' + _t('quarter'),
      range: moment.range(quarter.clone().startOf('quarter'), quarter.clone().endOf('quarter'))
    };
  })
};

var generateMonths = function (year) {
  return moment.months().map(function (monthName, monthIndex) {
    var month = moment().year(year).month(monthIndex);

    return {
      title: month.format('MMMM'),
      range: moment.range(month.clone().startOf('month'), month.clone().endOf('month'))
    };
  });
};

var generateWeeks = function (year, month) {
  var startDay = moment().year(year).month(month).startOf('month').startOf('week');
  var endDay = moment().year(year).month(month).endOf('month').endOf('week');

  var weeks = [];

  moment().range(startDay, endDay).by('weeks', function (week) {
    weeks.push({
      title: week.format('w'),
      range: moment.range(week.clone().startOf('week'), week.clone().endOf('week'))
    });
  });

  return weeks;
};

var generateDays = function (year, month) {
  var startDay = moment().year(year).month(month).startOf('month').startOf('week');
  var endDay = moment().year(year).month(month).endOf('month').endOf('week');
  var days = [];

  moment().range(startDay, endDay).by('days', function (day) {
    days.push({
      title: day.format('D'),
      isCurrentMonth: day.month() === month,
      range: moment.range(day.clone().startOf('day'), day.clone().endOf('day'))
    });
  });

  return days;
};

new Vue({
  el: '#calendar',
  rangeable: ['quarter', 'month', 'week', 'day'],

  data: function () {
    return {
      year: moment().get('year'),
      currentMonth: moment().get('month'),

      selectedPeriodStart: moment().startOf('month'),
      selectedPeriodEnd: moment().endOf('month'),

      // computed
      currentMonthTitle: '',
      quarters: [],
      months: [],
      days: [],
      weeks: [],

      // state info
      rangeInfo: {
        isStarted: false,
        rangeType: null
      }
    };
  },

  methods: {
    setYear: function (year) {
      this.year = year;
    },

    setMonth: function (month) {
      var monthsInYear = 12; // thank you, captain obvious

      if (month < 0) {
        this.year = this.year - 1;
      } else if (month >= monthsInYear) {
        this.year = this.year + 1;
      }

      this.currentMonth = ((month % monthsInYear) + monthsInYear) % monthsInYear; // positive modulus
    },

    selectDay: function (day) {
      this.setRange(day.range, 'day');
    },

    selectWeek: function (week) {
      this.setRange(week.range, 'week');
    },

    selectMonth: function (month) {
      this.setRange(month.range, 'month');
    },

    selectQuarter: function (quarter) {
      this.setRange(quarter.range, 'quarter');
    },

    setRange: function (range, rangeType) {
      var isAddToRange = this.rangeInfo.isStarted // start range exist
        && !range.start.isBefore(this.selectedPeriodEnd) // selected range is after start range type
        && (this.$options.rangeable.indexOf(rangeType) >= 0) // is rangeable
        && (rangeType === this.rangeInfo.rangeType); // start range type is the same as selected range type

      if (!isAddToRange) {
        this.selectedPeriodStart = range.start;
      }
      this.selectedPeriodEnd = range.end;

      this.rangeInfo.isStarted = !isAddToRange;
      this.rangeInfo.rangeType = rangeType;

      this.currentMonth = range.end.get('month');
    },

    isRangeSelected: function (range) {
      var selectedPeriod = moment.range(this.selectedPeriodStart, this.selectedPeriodEnd);
      return selectedPeriod.contains(range.start) && selectedPeriod.contains(range.end);
    },

    isRangePartiallySelected: function (range) {
      var selectedPeriod = moment.range(this.selectedPeriodStart, this.selectedPeriodEnd);
      return selectedPeriod.overlaps(range);
    }
  },

  filters: {
    momentStart: {
      read: function (momentDate) {
        return momentDate.format('DD.MM.YYYY');
      },
      write: function (dateString) {
        return moment(dateString, 'DD.MM.YYYY').startOf('day');
      }
    },
    momentEnd: {
      read: function (momentDate) {
        return momentDate.format('DD.MM.YYYY');
      },
      write: function (dateString) {
        return moment(dateString, 'DD.MM.YYYY').endOf('day');
      }
    }
  },

  computed: {
    quarters: function () {
      console.log('computed quarters ' + this.year);
      return generateQuarters(this.year);
    },

    months: function () {
      console.log('computed months ' + this.year);
      return generateMonths(this.year);
    },

    days: function () {
      console.log('computed days ' + this.year + '/' + this.currentMonth);
      return generateDays(this.year, this.currentMonth);
    },

    weeks: function () {
      console.log('computed weeks ' + this.year + '/' + this.currentMonth);
      return generateWeeks(this.year, this.currentMonth);
    },

    currentMonthTitle: function () {
      console.log('computed current month title ' + this.year + '/' + this.currentMonth);
      return moment.months('-MMMM-', this.currentMonth) + ', ' + this.year;
    }
  }
});