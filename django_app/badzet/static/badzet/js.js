var API_ENDPOINT = 'http://glejbadzet.knedl.si/';

// https://isci.parlameter.si/filter/kriza?people=80
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function capitalise(string) {
    return string[0].toUpperCase() + string.substring(1)
}

function getQueryParameters(str) {
    return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) {
        return n = n.split("="), this[n[0]] = n[1], this
    }.bind({}))[0];
}

function generateSearchUrl(queryParams) {
    var searchurl = "https://isci.parlameter.si/filter/" + query.q + '?';
    if (queryParams.name && queryParams.name.length > 0) {
        searchurl = searchurl + 'name=' + queryParams.name
    }
    if (queryParams.revenue_expenses && queryParams.revenue_expenses.length > 0) {
        if (!searchurl.endsWith('?')) {
            searchurl = searchurl + '&revenue_expenses=' + queryParams.revenue_expenses
        } else {
            searchurl = searchurl + 'revenue_expenses=' + queryParams.revenue_expenses
        }
    }
    if (queryParams.money && queryParams.money.length > 0) {
        if (!searchurl.endsWith('?')) {
            searchurl = searchurl + '&money=' + queryParams.money
        } else {
            searchurl = searchurl + 'money=' + queryParams.money
        }
    }
    if (queryParams.year && queryParams.year.length > 0) {
        if (!searchurl.endsWith('?')) {
            searchurl = searchurl + '&year=' + queryParams.year
        } else {
            searchurl = searchurl + 'year=' + queryParams.year
        }
    }
    if (queryParams.classification) {
        if (!searchurl.endsWith('?')) {
            searchurl = searchurl + '&classification=' + queryParams.classification
        } else {
            searchurl = searchurl + 'classification=' + queryParams.classification
        }
    }


    return searchurl;
}

function formatDate(date) {
    var month = date.getMonth();
    var year = date.getFullYear()

    switch(month) {
        case 0:
            return 'Januar ' + String(year);
            break;
        case 1:
            return 'Februar ' + String(year);
            break;
        case 2:
            return 'Marec ' + String(year);
            break;
        case 3:
            return 'April ' + String(year);
            break;
        case 4:
            return 'Maj ' + String(year);
            break;
        case 5:
            return 'Junij ' + String(year);
            break;
        case 6:
            return 'Julij ' + String(year);
            break;
        case 7:
            return 'Avgust ' + String(year);
            break;
        case 8:
            return 'September ' + String(year);
            break;
        case 9:
            return 'Oktober ' + String(year);
            break;
        case 10:
            return 'November ' + String(year);
            break;
        case 11:
            return 'December ' + String(year);
            break;
    }
}

function formatTimeFilter(date) {
    var day = 1;
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    return String(day) + '.' + String(month) + '.' + String(year);
}


var queryParams = getQueryParameters();
var query = {"q":queryParams.q};

var testis = new Vue({
    el: '.searchfilter-master-container',
    components: ['SearchDropdown'],
    computed: {
        klasifikacijePlaceholder: function() {
            if (this.klasifikacije[0]) {
                if (this.klasifikacije[0].id === 'loading') {
                    return 'Loading filters ...'
                }
            }
            return this.klasifikacijeSelected.length > 0 ? 'No. of chosen filters: ' + this.klasifikacijeSelected.length : 'Choose filters'
        },
        klasifikacijeSelected: function() {
            return this.klasifikacije
                .filter(function(tag) { return tag.selected })
                .map(function(tag) { return tag.id });
        },
        imenaPlaceholder: function() {
            if (this.imena[0]) {
                if (this.imena[0].id === 'loading') {
                    return 'Loading filters ...'
                }
            }
            return this.imenaSelected.length > 0 ? 'No. of chosen filters: ' + this.imenaSelected.length : 'Choose filters'
        },
        imenaSelected: function() {
            return this.imena
                .filter(function(tag) { return tag.selected })
                .map(function(tag) { return tag.id });
        },
        letaPlaceholder: function() {
            if (this.leta[0]) {
                if (this.leta[0].id === 'loading') {
                    return 'Loading filters ...'
                }
            }
            return this.letaSelected.length > 0 ? 'No. of chosen filters: ' + this.letaSelected.length : 'Choose filters'
        },
        letaSelected: function() {
            return this.leta
                .filter(function(tag) { return tag.selected })
                .map(function(tag) { return tag.id });
        },
        revex: function() {
            let temprevex = this.rev ? 'inc' : '';
            temprevex = temprevex + (this.exp ? '|exp' : '');
            return temprevex;
        },
        queryString: function() {
            // const money = $('.slider').val();
            const names = encodeURIComponent(this.imenaSelected.reduce((acc, val) => {
                if (this.imenaSelected.indexOf(val) < this.imenaSelected.length - 1) {
                    return acc + val + '|';   
                }
                return acc + val;
            }, ''));
            const revex = this.revex; // TODO
            const years = this.letaSelected.reduce((acc, val) => {
                if  (this.letaSelected.indexOf(val) < this.letaSelected.length - 1) {
                    return acc + val + ',';
                }
                return acc + val
            }, '');
            const classifications = encodeURIComponent(this.klasifikacijeSelected.reduce((acc, val) => {
                if (this.klasifikacijeSelected.indexOf(val) < this.klasifikacijeSelected.length - 1) {
                    return acc + val + '|';
                }
                return acc + val;
            }, ''));
            return 'http://badzet.knedl.si/api/get-data/?money=' + this.moneys + '&name=' + names + '&revenue_expenses=' + revex + '&year=' + years + '&classification=' + classifications;
        }
    },
    filters: function() {
        return {
            klasifikacije: this.klasifikacije
        }
    },
    mounted: function() {
        var self = this;
        $.get('http://badzet.knedl.si/api/get-data/', function(response) {
            self.klasifikacije = response.data.reduce((acc, row) => {
                if (acc.indexOf(row['classification']) === -1) {
                acc.push(row['classification']);
                }
                return acc;
            }, []).map((category) => {
                return {
                    label: category,
                    id: category,
                    selected: false
                };
            });

            self.imena = response.data.reduce((acc, row) => {
                if (acc.indexOf(row['name']) === -1) {
                acc.push(row['name']);
                }
                return acc;
            }, []).map((category) => {
                return {
                    label: category,
                    id: category,
                    selected: false
                };
            });
        });
    },
    data: function() {
        return {
            klasifikacije: [{id: 'loading', label: 'Loading filters ...', selected: false}],
            imena: [{id: 'loading', label: 'Loading filters ...', selected: false}],
            leta: [{id: '2005', label:  '2005', selected: false}, {id: '2006', label:  '2006', selected: false}, {id: '2007', label:  '2007', selected: false}, {id: '2008', label:  '2008', selected: false}, {id: '2009', label:  '2009', selected: false}, {id: '2010', label:  '2010', selected: false}, {id: '2011', label:  '2011', selected: false}, {id: '2012', label:  '2012', selected: false}, {id: '2013', label:  '2013', selected: false}, {id: '2014', label:  '2014', selected: false}],
            dtchecked: false,
            first_load: true,
            fetching: false,
            rev: false,
            exp: false,
            moneys: '',
        }
    },
    methods: {
        handleRevCheckbox: function(event) {
            this.rev = !this.rev;
        },
        handleExpCheckbox: function(event) {
            this.exp = !this.exp;
        },
        reloadCards: function() {
            var self = this;
            $("#session_search_results_filter .getmedata").each(function (i, thing) {
                // console.log(thing);
                var urlid = $(thing).attr('id');
                // console.log(urlid);

                var url = API_ENDPOINT + "c/" + urlid + "/?customUrl=" + encodeURIComponent(self.queryString);
                console.log(self.queryString);
                console.log(url);
                $("#" + urlid).html('<div class="card-container card-halfling"><div class="card-header"><div class="card-header-border"></div><h1>Loading card ...</h1></div><div class="card-content half"><div class="card-content-front"><div class="nalagalnik"></div></div></div><div class="card-footer"><div class="card-logo hidden"><a href="https://skoraj.parlameter.si/"><img src="https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg" alt="parlameter logo"></a></div><div class="card-circle-button card-share" data-back="share"></div><div class="card-circle-button card-embed" data-back="embed"></div><div class="card-circle-button card-info" data-back="info">i</div></div></div>');
                // $("#" + urlid).html('<script>(function(d,script){script=d.createElement(\'script\');script.type=\'text/javascript\';script.async=true;script.onload=function(){iFrameResize({log:true,checkOrigin:false})};script.src=\'https://cdn.parlameter.si/v1/parlassets/js/iframeResizer.min.js\';d.getElementsByTagName(\'head\')[0].appendChild(script);}(document));</script><iframe frameborder="0" width="100%" src="' + url + '"></iframe>');

                var jqxhr = $.ajax(url)
                    .done(function (data) {
                        // console.log('[GOT DATA]');
                        // console.log(urlid);
                        // console.log(data);
                        // console.log($('#' + urlid));
                        $("#" + urlid).html(data);
                        // console.log($('#' + urlid).html());
                        // DNDrepeatEmbedCall();
                    })
                    .fail(function () {
                        $("#" + urlid).html(urlid + " error");
                    })
                    .always(function () {
                    });
            });
        }
    },
    watch: {
        queryString: function() {
            this.reloadCards();
        },
        // klasifikacijeSelected: function() {
        //     this.reloadCards();
        // },
        // letaSelected: function() {
        //     this.reloadCards();
        // },
        // revex: function() {
        //     this.reloadCards();
        // }
    }
});





var progressbarTooltip = {
    init: function(classname) {

        var $majorparent = $('.' + classname);

        $majorparent.append('<div class="progressbar-tooltip tooltip-' + classname + '"></div>');

        $majorparent.find('.tooltipme')
            .on('mouseover', function(e) {

                $('.tooltip-' + classname)
                    .css('opacity', 0.9)
                    .html($(this).data('tooltiptext'))
                    .css("left", (e.pageX - ($('.tooltip-' + classname).width() / 2) - $majorparent.offset().left))
                    .css("top", (e.pageY + 40 - $majorparent.offset().top));

            })
            .on('mouseout', function(e) {
                $('.tooltip-' + classname)
                    .css('opacity', 0);
            });
    }
}

$(document).ready(function() {
    progressbarTooltip.init('session-search-container');
    $("#slider").slider({}).on('slideStop', function() {
        testis.moneys = $('#slider').val();
        // testis.reloadCards();
    });
});


function session_search_results_with_filters() {

    console.log('session_search_results_with_filters');

    if ($("#session_search_results_filter").length < 1) {
        return false;
    }

    function getQueryParameters(str) {
        return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) {
            return n = n.split("="), this[n[0]] = n[1], this
        }.bind({}))[0];
    }

    function encodeQueryData(data) {
        var ret = [];
        for (var d in data)
            //ret.push(encodeURIComponent(d) + '/' + encodeURIComponent(data[d]));
            ret.push((d) + '/' + encodeURIComponent(data[d]));
        return ret.join('&');
    }

    //var queries = ["raba-skozi-cas", "raba-po-strankah", "najveckrat-so-pojem-uporabili", "nastopi-v-katerih-je-bil-iskalni-niz-izrecen"]

    var queryParams = getQueryParameters();
    console.log(queryParams);
    var querystring = encodeQueryData(queryParams);
    console.log(querystring);

    $("#session_search_results_filter .getmedata").each(function (i, thing) {
        // console.log(thing);
        var urlid = $(thing).attr('id');
        // console.log(urlid);
        var searchurl = "http://badzet.knedl.si/api/get-data/" + '?';
        if (queryParams.name) {
            searchurl = searchurl + 'name=' + queryParams.name
        }
        if (queryParams.revenue_expenses) {
            if (!searchurl.endsWith('?')) {
                searchurl = searchurl + '&revenue_expenses=' + queryParams.revenue_expenses
            } else {
                searchurl = searchurl + 'revenue_expenses=' + queryParams.revenue_expenses
            }
        }
        if (queryParams.money) {
            if (!searchurl.endsWith('?')) {
                searchurl = searchurl + '&money=' + queryParams.money
            } else {
                searchurl = searchurl + 'money=' + queryParams.money
            }
        }
        if (queryParams.year) {
            if (!searchurl.endsWith('?')) {
                searchurl = searchurl + '&year=' + queryParams.year
            } else {
                searchurl = searchurl + 'year=' + queryParams.year
            }
        }
        if (queryParams.classification) {
            if (!searchurl.endsWith('?')) {
                searchurl = searchurl + '&classification=' + queryParams.classification
            } else {
                searchurl = searchurl + 'classification=' + queryParams.classification
            }
        }

        var url = (API_ENDPOINT + "c/" + urlid + "/?customUrl=" + encodeURIComponent(searchurl));
        console.log(url);
        $("#" + urlid).html('<div class="card-container card-halfling"><div class="card-header"><div class="card-header-border"></div><h1>Loading card ...</h1></div><div class="card-content half"><div class="card-content-front"><div class="nalagalnik"></div></div></div><div class="card-footer"><div class="card-logo hidden"><a href="https://skoraj.parlameter.si/"><img src="https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg" alt="parlameter logo"></a></div><div class="card-circle-button card-share" data-back="share"></div><div class="card-circle-button card-embed" data-back="embed"></div><div class="card-circle-button card-info" data-back="info">i</div></div></div>');
        // $("#" + urlid).html('<script>(function(d,script){script=d.createElement(\'script\');script.type=\'text/javascript\';script.async=true;script.onload=function(){iFrameResize({log:true,checkOrigin:false})};script.src=\'https://cdn.parlameter.si/v1/parlassets/js/iframeResizer.min.js\';d.getElementsByTagName(\'head\')[0].appendChild(script);}(document));</script><iframe frameborder="0" width="100%" src="' + url + '"></iframe>');

        var jqxhr = $.ajax(url)
            .done(function (data) {
                // console.log('[GOT DATA]');
                // console.log(urlid);
                // console.log(data);
                // console.log($('#' + urlid));
                $("#" + urlid).html(data);
                // console.log($('#' + urlid).html());
                // DNDrepeatEmbedCall();
            })
            .fail(function () {
                $("#" + urlid).html(urlid + " error");
            })
            .always(function () {
            });
    });
}

session_search_results_with_filters();
