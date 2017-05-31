function autoSelectText() {
    $(".embed-script textarea, .share-content input.share-url").on("focus", function () {
        $(this).select();
    });
}

function checkCardEmbed() {
    if (window.location.search && (window.location.search.indexOf("frame=true") > -1 || window.location.search.indexOf("embed=true") > -1)) {
        $(".card-footer .card-logo").removeClass("hidden");
    }
}

function DNDrepeatEmbedCall() {
    // votingCardHorizontal.init();

    if ($(".session_transcript .status").length > 0) {
        $(".session_transcript .status").click(function () {
            $(this).parent().toggleClass("collapsed");
            return false;
        });
    }
}

// card flipping
function makeEmbedSwitch() {
    // $('.embed-switch-box').on('click', function() {
    //     $(this).toggleClass('off');
    // });

    $('.embed-switch-big-box').not('.not').off('click');
    $('.embed-switch-big-box').not('.not').on('click', function () {

        var thechild = $(this).parent().next().next().children('textarea');
        var todaysdate = new Date;
        var today = '' + todaysdate.getDay() + '.' + todaysdate.getMonth() + '.' + todaysdate.getFullYear();

        if ($(this).children('.embed-switch-box').hasClass('off')) {
            console.log(thechild.data('url') + thechild.data('id'));
            // thechild.val('<div class="parlameter-card" data-src="' + thechild.data('url')  + thechild.data('id') + '/"></div>\n<script defer src="https://cdn.parlameter.si/v1/lib/js/embed.script.js"></script>');
            thechild.val('<script>(function(d,script){script=d.createElement(\'script\');script.type=\'text/javascript\';script.async=true;script.onload=function(){iFrameResize({log:true,checkOrigin:false})};script.src = \'https://cdn.parlameter.si/v1/parlassets/js/iframeResizer.min.js\';d.getElementsByTagName(\'head\')[0].appendChild(script);}(document));</script><iframe frameborder="0" width="100%" src="' + thechild.data('url') + thechild.data('id') + '?embed=true&altHeader=true"></iframe>')

            $(this).children('.embed-switch-box').removeClass('off');
        } else {
            // thechild.val('<div class="parlameter-card" data-src="' + thechild.data('url')  + thechild.data('id') + '/' + today + '/"></div>\n<script defer src="https://cdn.parlameter.si/v1/lib/js/embed.script.js"></script>');
            thechild.val('<script>(function(d,script){script=d.createElement(\'script\');script.type=\'text/javascript\';script.async=true;script.onload=function(){iFrameResize({log:true,checkOrigin:false})};script.src = \'https://cdn.parlameter.si/v1/parlassets/js/iframeResizer.min.js\';d.getElementsByTagName(\'head\')[0].appendChild(script);}(document));</script><iframe frameborder="0" width="100%" src="' + thechild.data('url') + thechild.data('id') + '/' + today + '?embed=true&altHeader=true"></iframe>')
            console.log(thechild.data('url') + thechild.data('id') + today);

            $(this).children('.embed-switch-box').addClass('off');
        }
    });
}

function addCardFlip() {

    $('.back .card-content').height($('.front .card-content').height());
    $('.back').css({
        'width': $('.front').width(),
    });

    $('.front .card-circle-button').on('click', function () {
        $('.back-info, .back-share, .back-embed').not('.back-' + $(this).data('back')).addClass('hidden');
        $('.back-' + $(this).data('back')).removeClass('hidden');
        $(this).parents('.card-container').toggleClass('flipped');
    });

    $('.back .card-circle-button').on('click', function () {
        $(this).parents('.card-container')
            .toggleClass('flipped');

        var _this = this;
        window.setTimeout(function () {
            $('.back-info, .back-share, .back-embed').not('.back-' + $(_this).data('back')).addClass('hidden');
            $('.back-' + $(_this).data('back')).removeClass('hidden');
            if (!$(_this).hasClass('card-exit')) {
                $(_this).parents('.card-container').toggleClass('flipped');
            }
        }, 600);
    });

    $('.share-content').css({
        'padding-top': ($('.share-content').parent().height() - $('.share-content').height()) / 2
    });
}

function copyToClipboard(elem, button) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }

    if (succeed) {
        button.textContent = "COPIED!";
    }
    return succeed;
}

function activateCopyButton() {
    $('.btn-copy-embed, .card-content-share button').on('click', function () {
        copyToClipboard($(this).prev()[0], this);
    });
}

var shortened = false;
// card rippling (flipping)
var cardRippling = false;

function addCardRippling(element) {
    $('.card-circle-button').off('click');
    $('.card-circle-button').on('click', function (e) {
        if ($(this).parent().data('shortened') !== true) {
            var $shareurl = $(this).parent().prev().find('.share-url');
            $.get('https://parla.me/shortner/generate?url=' + window.encodeURIComponent($shareurl.val()), function (r) {
                $shareurl.val(r);
            });
            $(this).parent().data('shortened', true);
        }
        if (!cardRippling) {

            cardRippling = true;

            var $parentcontainer = $(this).parents('.card-container');
            var $this = $(this);

            var $header = $parentcontainer.children('.card-header').children('h1');
            if (!$header.data('original')) {
                $header.data('original', $header.text());
            }

            var cardTitles = {
                'share': 'Share',
                'embed': 'Embed',
                'info': 'Info'
            };

            if (!$(this).hasClass('card-exit')) { // show back

                $parentcontainer.children('.card-content').height($parentcontainer.children('.card-content').height());

                $parentcontainer
                    .children('.card-footer')
                    .children('.card-circle-button')
                    .text('')
                    .removeClass('card-exit');
                $parentcontainer
                    .children('.card-footer')
                    .children('.card-info')
                    .text('i');

                $(this)
                    .text('Ă')
                    .addClass('card-exit');

                $parentcontainer
                    .addClass('covered')
                    .addClass('clicked-' + $this.data('back'));

                window.setTimeout(function () {
                    $parentcontainer.children('.card-content').children().addClass('hidden');
                }, 200);

                window.setTimeout(function () {
                    var newTitle = cardTitles[$this.data('back')];
                    if (newTitle) $header.text(newTitle);
                    $parentcontainer.children('.card-content').children('.card-content-' + $this.data('back')).removeClass('hidden');
                }, 250);

                window.setTimeout(function () {
                    $parentcontainer
                        .removeClass('covered')
                        .removeClass('clicked-' + $this.data('back'));

                    cardRippling = false;
                }, 600);

            } else {

                $(this).removeClass('card-exit');

                $parentcontainer
                    .children('.card-footer')
                    .children('.card-circle-button')
                    .text('');

                $parentcontainer
                    .children('.card-footer')
                    .children('.card-info')
                    .text('i');

                $parentcontainer
                    .addClass('revealed')
                    .addClass('clicked-' + $this.data('back'));

                window.setTimeout(function () {
                    $parentcontainer.children('.card-content').children().addClass('hidden');
                }, 200);

                window.setTimeout(function () {
                    $header.text($header.data('original'));
                    $parentcontainer.children('.card-content').children('.card-content-front').removeClass('hidden');
                }, 250);

                window.setTimeout(function () {
                    $parentcontainer
                        .removeClass('revealed')
                        .removeClass('clicked-' + $this.data('back'));

                    $parentcontainer.children('.card-content').attr('style', '');

                    cardRippling = false;
                }, 1000);
            }
        }
    });
}

