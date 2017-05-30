var API_ENDPOINT = 'http://glejbadzet.knedl.si';

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
        kategorijePlaceholder: function() {
            if (this.kategorije[0]) {
                if (this.kategorije[0].id === 'loading') {
                    return 'Nalagamo filtre ...'
                }
            }
            return this.kategorijeSelected.length > 0 ? 'Izbranih filtrov: ' + this.kategorijeSelected.length : 'Izberi filtre'
        },
        kategorijeSelected: function() {
            return this.kategorijeSelected
                .filter(function(tag) { return tag.selected })
                .map(function(tag) { return tag.id });
        },
        // casinputPlaceholder: function() {
        //     if (this.caspodatki[0]) {
        //         if (this.caspodatki[0].id === 'loading') {
        //             return 'Nalagamo filtre ...'
        //         }
        //     }
        //     return this.casselectedTags.length > 0 ? 'Izbranih filtrov: ' + this.casselectedTags.length : 'Izberi filtre'
        // },
        // casselectedTags: function() {
        //     return this.caspodatki
        //         .filter(function(tag) { return tag.selected })
        //         .map(function(tag) { return tag.id });
        // },
        // dtinputPlaceholder: function() {
        //     if (this.dtdisabled) {
        //         return 'Ni delovnih teles.';
        //     }
        //     if (this.dtpodatki[0]) {
        //         if (this.dtpodatki[0].id === 'loading') {
        //             return 'Nalagamo delovna telesa ...'
        //         }
        //     }
        //     return this.dtselectedTags.length > 0 ? 'Izbranih delovnih teles: ' + this.dtselectedTags.length : 'Izberi delovna telesa'
        // },
        // dtselectedTags: function() {
        //     return this.dtpodatki
        //         .filter(function(tag) { return tag.selected })
        //         .map(function(tag) { return tag.id });
        // },
        // filters: function() {
        //     return {
        //         people: this.ppsselectedTags
        //             .filter(function(tag) {
        //                 return tag.indexOf('ps') === -1;
        //             })
        //             .map(function(tag) {
        //                 return tag.split('p')[1];
        //             }),
        //         revenue_expenses: this.ppsselectedTags
        //             .filter(function(tag) {
        //                 return tag.indexOf('ps') !== -1;
        //             }).map(function(tag) {
        //                 return tag.split('ps')[1];
        //             }),
        //         money: this.caspodatki
        //             .filter(function(tag) {
        //                 return tag.selected;
        //             }).map(function(tag) {
        //                 return '1.' + String(new Date(tag.date).getMonth() + 1) + '.' + String(new Date(tag.date).getFullYear());
        //             }),
        //         year: this.dtpodatki
        //             .filter(function(tag) {
        //                 return tag.selected;
        //             }).map(function(tag) {
        //                 return tag.id;
        //             }),
        //         classification: this.classification
        //     }
        // },
        // dtchecked: function() {
        //     var tmpchecked = this.dtselectedTags.length > 0 ? true : false;
        //     return tmpchecked
        // }
    },
    mounted: function() {
        var self = this;
        $.get('http://badzet.knedl.si/api/get-data/', function(response) {
            console.log(response);
            console.log('this is the response\n\n\n\n');
            self.kategorije = response.data.map((row) => {
                return {
                    label: row.classification,
                    id: row.classifcation,
                    selected: false
                }
            });
        });
        // var self = this;
        // $.get(generateSearchUrl(getQueryParameters()), function(response) {
        //     self.fetching = false;
        //     // poslanci in poslanske skupine
        //     var poslanci = response.facet_counts.facet_fields.speaker_i
        //         .filter(function(person) {
        //             return person.score > 0;
        //         })
        //         .map(function(person) {
        //             var tagperson = {
        //                 id: 'p' + String(person.person.id),
        //                 label: person.person.name,
        //                 count: person.score,
        //                 selected: false
        //             }
        //             if (query.people) {
        //                 query.people.split(',').forEach(function(element) {
        //                     if (element === String(person.person.id)) {
        //                         tagperson.selected = true
        //                     }
        //                 });
        //             }
        //             return tagperson
        //         })
        //         .sort(function(a, b) {
        //             return b.count - a.count;
        //         });

        //     console.log(poslanci);

        //     var ps = response.facet_counts.facet_fields.party_e
        //         .filter(function(party) {
        //             return party.score > 0;
        //         })
        //         .map(function(party) {
        //             var tagparty = {
        //                 id: 'ps' + String(party.party.id),
        //                 label: party.party.name,
        //                 count: party.score,
        //                 selected: false
        //             }
        //             if (query.revenue_expenses && query.revenue_expenses.indexOf(String(party.party.id)) !== -1) {
        //                 tagparty.selected = true
        //             }
        //             return tagparty
        //         })
        //         .sort(function(a, b) {
        //             return b.count - a.count;
        //         });

        //     console.log(ps);

        //     self.ppspodatki = poslanci.concat(ps);

        //     console.log(poslanci.concat(ps));
        //     console.log(self.ppspodatki);

        //     self.ppsskupine = [
        //         {
        //             label: 'Poslanke in poslanci',
        //             items: poslanci.map(function (person) {
        //                 return person.id;
        //             })
        //         }, {
        //             label: 'Poslanske skupine',
        //             items: ps.map(function (party) {
        //                 return party.id;
        //             })
        //         }
        //     ]

        //     // cas
        //     var castemp = [];
        //     response.facet_counts.facet_ranges.datetime_dt.counts.forEach(function (e, i) {
        //         if (i % 2 === 0 && response.facet_counts.facet_ranges.datetime_dt.counts[i + 1] !== 0) {
        //             tempobject = {
        //                 id: e,
        //                 date: new Date(e),
        //                 label: formatDate(new Date(e)),
        //                 selected: false,
        //                 count: response.facet_counts.facet_ranges.datetime_dt.counts[i + 1]
        //             }

        //             if (query.money) { // && formatTimeFilter(new Date(e)).indexOf(query.money) !== -1) {
        //                 query.money.split(',').forEach(function (element) {
        //                     if (formatTimeFilter(new Date(e)) === element) {
        //                         tempobject.selected = true
        //                     }
        //                 });
        //             }

        //             castemp.push(tempobject);
        //         }
        //     });
        //     self.caspodatki = castemp.sort(function(a, b) {
        //         return new Date(a.date) - new Date(b.date);
        //     });

        //     // delovna telesa
        //     self.dtpodatki = response.organizations.map(function (year) {

        //         var tempobject = {
        //             id: year.id,
        //             label: year.name,
        //             selected: false,
        //             count: year.score
        //         };

        //         if (query.year) { // && formatTimeFilter(new Date(e)).indexOf(query.money) !== -1) {
        //             query.year.split(',').forEach(function (element) {
        //                 if (String(year.id) === element) {
        //                     tempobject.selected = true
        //                 }
        //             });
        //         }

        //         return tempobject;
        //     })
        //         .sort(function(a, b) {
        //             return b.count - a.count;
        //         });
        //     if (!response.has_council_score) {
        //         self.kolegijDisabled = true;
        //     }
        //     if (!response.has_classification_score) {
        //         self.classificationDisabled = true;
        //     }
        //     if (query.classification) {
        //         self.classification = true;
        //     }
        //     if (response.organizations.length === 0) {
        //         self.dtdisabled = true;
        //     }

        //     window.setTimeout(function() {self.first_load = false;}, 1000);
        // });
    },
    data: function() {
        return {
            kategorije: [{id: 'loading', label: 'Nalagamo filtre ...', selected: false}],
            // ppsskupine: [{label: '', items: 'loading'}],
            // caspodatki: [{id: 'loading', label: 'Nalagamo filtre ...', selected: false}],
            // dtpodatki: [{id: 'loading', label: 'Nalagamo delovna telesa ...', selected: false}],
            dtchecked: false,
            first_load: true,
            fetching: false,
            classificationDisabled: false,
            kolegijDisabled: false,
            dtdisabled: false,
            classification: false
        }
    },
    methods: {
        toggleclassification: function(event) {
            if (this.classification) {
                this.classification = false;
            } else {
                this.classification = true;
            }

            this.filterMyResults();
        },
        handleCheckbox: function(event) {
            if (!testis.dtchecked) {
                testis.dtpodatki.map(function (tag) {
                    tag.selected = true;
                    return tag
                });
            } else {
                testis.dtpodatki.map(function (tag) {
                    tag.selected = false;
                    return tag
                });
            }
        },
        filterMyResults: function(event) {
            var filterparams = ''
            if (testis.filters.name.length > 0) {
                filterparams = filterparams + '&name=' + testis.filters.name.join(',')
            }
            if (testis.filters.revenue_expenses.length > 0) {
                filterparams = filterparams + '&revenue_expenses=' + testis.filters.revenue_expenses.join(',')
            }
            if (testis.filters.money.length > 0) {
                filterparams = filterparams + '&money=' + testis.filters.money.join(',')
            }
            if (testis.filters.year.length > 0) {
                filterparams = filterparams + '&year=' + testis.filters.year.join(',')
            }
            if (testis.filters.classification) {
                filterparams = filterparams + '&classification=' + testis.filters.classification
            }

            document.location.href = '/seje/isci/filter?q=' + query.q + filterparams
        }
    },
    watch: {
        ppsselectedTags(newVal, oldVal) {
            if (JSON.stringify(newVal) !== JSON.stringify(oldVal) && !this.first_load) {
                this.filterMyResults();
            }
        },
        casselectedTags(newVal, oldVal) {
            if (JSON.stringify(newVal) !== JSON.stringify(oldVal) && !this.first_load) {
                this.filterMyResults();
            }
        },
        dtselectedTags(newVal, oldVal) {
            if (JSON.stringify(newVal) !== JSON.stringify(oldVal) && !this.first_load) {
                this.filterMyResults();
            }
        }
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

$(document).ready(function() {progressbarTooltip.init('session-search-container');});






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

        var url = ("http://glejbadzet.knedl.si/c/" + urlid + "/?embed=true&customUrl=" + encodeURIComponent(searchurl));
        console.log(url);
        // $("#" + urlid).html('<div class="card-container card-halfling"><div class="card-header"><div class="card-header-border"></div><h1>Nalagamo kartico ...</h1></div><div class="card-content half"><div class="card-content-front"><div class="nalagalnik"></div></div></div><div class="card-footer"><div class="card-logo hidden"><a href="https://skoraj.parlameter.si/"><img src="https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg" alt="parlameter logo"></a></div><div class="card-circle-button card-share" data-back="share"></div><div class="card-circle-button card-embed" data-back="embed"></div><div class="card-circle-button card-info" data-back="info">i</div></div></div>');
        $("#" + urlid).html('<script>(function(d,script){script=d.createElement(\'script\');script.type=\'text/javascript\';script.async=true;script.onload=function(){iFrameResize({log:true,checkOrigin:false})};script.src=\'https://cdn.parlameter.si/v1/parlassets/js/iframeResizer.min.js\';d.getElementsByTagName(\'head\')[0].appendChild(script);}(document));</script><iframe frameborder="0" width="100%" src="' + url + '"></iframe>');

        // var jqxhr = $.ajax(url)
        //     .done(function (data) {
        //         // console.log('[GOT DATA]');
        //         // console.log(urlid);
        //         // console.log(data);
        //         // console.log($('#' + urlid));
        //         $("#" + urlid).html(data);
        //         // console.log($('#' + urlid).html());
        //         // DNDrepeatEmbedCall();
        //     })
        //     .fail(function () {
        //         $("#" + urlid).html(urlid + " error");
        //     })
        //     .always(function () {
        //     });
    });
}

session_search_results_with_filters();
