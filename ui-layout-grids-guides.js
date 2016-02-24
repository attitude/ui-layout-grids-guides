(function (w, options, localCss) {
    'use strict';

    var guides = [],
        visible = false,
        toggle = function() {
            if (visible) {
                w.document.body.parentElement.className = w.document.body.parentElement.className.replace(/ ui-layout-grids-guides-visible/, '');
            } else {
                w.document.body.parentElement.className += ' ui-layout-grids-guides-visible';
            }

            visible = !visible;

            attach();
        },
        resizeDelay;

    if (!options) {
        options = [{
            minWidth: 0,
            rules: {
                marginLeft: 8,
                marginRight: 8,
                marginTop: 0,
                marginBottom: 0,
                baselineOffset: 16,
                columns: 1,
                columnsGutter: 8,
                columnsPadding: 16
            }
        }, {
            minWidth: 160,
            rules: {
                columns: 2
            }
        }, {
            minWidth: 240,
            rules: {
                columns: 3
            }
        }, {
            minWidth: 320,
            rules: {
                marginLeft: 11,
                marginRight: 11,
                baselineOffset: 22,
                columns: 4,
                columnsGutter: 11,
                columnsPadding: 22
            }
        }, {
            minWidth: 480,
            rules: {
                columns: 6
            }
        }, {
            minWidth: 640,
            rules: {
                marginLeft: 22,
                marginRight: 22,
                marginTop: 22,
                marginBottom: 22,
                columns: 12
            }
        }, {
            minWidth: 1024,
            rules: {
                maxWidth: 1024 - 22 - 22
            }
        }, {
            minWidth: 1440,
            rules: {
                marginLeft: 28,
                marginRight: 28,
                marginTop: 28,
                marginBottom: 28,
                baselineOffset: 28,
                columnsGutter: 15,
                columns: 12
            }
        }];
    }

    function addGuide(guideName, offset, target) {
        if (!guideName) {
            w.console.warn('Skipping guide: no name given');
            return;
        }

        if (!offset || Object.prototype.toString.call(offset) !== '[object Array]' || offset.length !== 4 || offset.indexOf('auto') < 0) {
            w.console.warn('Skipping guide: no offset given or not an array of 4 offsets');
            return;
        }

        if (!target) {
            target = w.document.body;
        }

        var el = document.createElement('div');
        el.setAttribute('class', 'ui-layout-grids-guides-guide-' + guideName);

        if (offset[0] !== 'auto') {
            el.style.top = offset[0] + 'px';
        }
        if (offset[1] !== 'auto') {
            el.style.right = offset[1] + 'px';
        }
        if (offset[2] !== 'auto') {
            el.style.bottom = offset[2] + 'px';
        }
        if (offset[3] !== 'auto') {
            el.style.left = offset[3] + 'px';
        }

        target.appendChild(el);

        guides.push(el);
    }

    function addColumn(guideName, top, right, bottom, left) {
        addGuide(guideName + '-horizontal', [top || 0, right || 0, 'auto', left || 0]);
        addGuide(guideName + '-vertical',   [top || 0, right || 0, bottom || 0, 'auto']);
        addGuide(guideName + '-horizontal', ['auto', right || 0, bottom || 0, left || 0]);
        addGuide(guideName + '-vertical',   [top || 0, 'auto', bottom || 0, left || 0]);
    }

    function addBaselineGuide(guideName, target, offset) {
        if (!guideName) {
            w.console.warn('Skipping guide: no name given');
            return;
        }

        if (!offset && offset !== 0) {
            w.console.warn('Skipping guide: no offset given');
            return;
        }

        if (!target) {
            target = w.document.body;
        }

        var el = document.createElement('div');
        el.setAttribute('class', 'ui-layout-grids-guides-' + guideName);
        el.style.top = offset + 'px';
        target.appendChild(el);

        guides.push(el);
    }

    function addBaselineGrid(guideName, start, offset, target) {
        if (!guideName) {
            w.console.warn('Skipping guide: no name given');
            return;
        }

        if (!target) {
            target = w.document.body;
        }

        if (!start) {
            start = 0;
        }

        if (!offset) {
            offset = 20;
        }

        var height = target.clientHeight,
            i;

        for (i = start; i < height; i = i + offset) {
            addBaselineGuide(guideName, target, i);
        }
    }

    function addColumnsGrid(guideName, columns, gutter, marginTop, marginRight, marginBottom, marginLeft) {
        if (!guideName) {
            w.console.warn('Skipping guide: no name given');
            return;
        }

        if (columns <= 0) {
            w.console.warn('Skipping columns: no columns');
            return;
        }

        columns = parseInt(columns, 10);
        gutter  = parseInt(gutter,  10);

        marginTop    = parseInt(marginTop,  10);
        marginRight  = parseInt(marginRight, 10);
        marginBottom = parseInt(marginBottom,  10);
        marginLeft   = parseInt(marginLeft,  10);

        gutter = gutter >= 0 ? gutter : 0;

        var screenHeight = w.document.body.clientHeight,
            screenWidth  = w.document.body.clientWidth,
            width = screenWidth - marginLeft - marginRight,
            columnWidth = (width - ((columns - 1) * gutter)) / columns,
            i;

//        console.log({
//            screenWidth: screenWidth,
//            width: width,
//            colWidth: columnWidth,
//            columns: columns,
//            gutter: gutter,
//            marginTop: marginTop,
//            marginRight: marginRight,
//            marginBottom: marginBottom,
//            marginLeft: marginLeft
//        });

        for (i = 0; i < columns; i = i + 1) {
            addColumn(
                guideName,
                marginTop,
                marginRight + (columnWidth + gutter) * (columns - (i + 1)),
                marginBottom,
                marginLeft + (columnWidth * i) + gutter * i
            );
        }
    }

    function detach() {
        var l = guides.length,
            i;

        for (i = 0; i < l; i = i + 1) {
            guides[i].parentNode.removeChild(guides[i]);
        }

        guides = [];
    }

    function deepExtend(out) {
        var i, key, obj;

        out = out || {};

        for (i = 1; i < arguments.length; i = i + 1) {
            obj = arguments[i];

            if (!obj) {
                continue;
            }

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        deepExtend(out[key], obj[key]);
                    } else {
                        out[key] = obj[key];
                    }
                }
            }
        }

        return out;
    }

    function attach() {
        console.log('Attach!');
        detach();

        if (!visible) {
            return;
        }

        var screenHeight = w.document.body.clientHeight,
            screenWidth  = w.document.body.clientWidth,
            optionsLength = options.length,
            currentOptions = {},
            automargin,
            i;

        for (i = 0; i < optionsLength; i = i + 1) {
            if (!options[i].hasOwnProperty('rules')) {
                w.console.warn('Skipping option: missing rules attribute');
                continue;
            }

            if (options[i].hasOwnProperty('minWidth') && screenWidth < options[i].minWidth) {
                continue;
            }

            if (options[i].hasOwnProperty('minHeight') && screenHeight < options[i].minHeight) {
                continue;
            }

            currentOptions = deepExtend(currentOptions, options[i].rules);
        }

        if (currentOptions.hasOwnProperty('maxWidth') && screenWidth - currentOptions.maxWidth > currentOptions.marginLeft + currentOptions.marginRight) {
            automargin = parseInt((screenWidth - currentOptions.maxWidth - currentOptions.marginLeft - currentOptions.marginRight) / 2, 10)
            currentOptions.marginLeft  += automargin;
            currentOptions.marginRight += automargin;
        }

        addColumnsGrid(
            'column',
            currentOptions.columns || 1,
            currentOptions.columnsGutter || 0,
            currentOptions.marginTop || 0,
            currentOptions.marginRight || 0,
            currentOptions.marginBottom || 0,
            currentOptions.marginLeft || 0
        );

        addColumnsGrid(
            'padding',
            currentOptions.columns && currentOptions.columns > 2 && currentOptions.columns / 2 || 1,
            currentOptions.columnsGutter && currentOptions.columnsPadding && currentOptions.columnsPadding * 2 + currentOptions.columnsGutter || 0,
            currentOptions.marginTop || 0,
            currentOptions.marginRight && currentOptions.columnsPadding && currentOptions.marginRight + currentOptions.columnsPadding || 0,
            currentOptions.marginBottom || 0,
            currentOptions.marginLeft && currentOptions.columnsPadding && currentOptions.marginLeft + currentOptions.columnsPadding || 0
        );

        addColumn('margin', currentOptions.marginTop || 0, currentOptions.marginRight || 0, currentOptions.marginBottom || 0, currentOptions.marginLeft || 0);

        addBaselineGrid('guide-baseline', currentOptions.marginTop || 0, currentOptions.baselineOffset || 20);
        addBaselineGrid('guide-baseline-half', (currentOptions.marginTop || currentOptions.marginTop === 0) && currentOptions.baselineOffset && currentOptions.marginTop + currentOptions.baselineOffset / 2 || 10, currentOptions.baselineOffset || 20);
    }

    function init() {
        var e;

        e = document.createElement('link');
        e.rel = 'stylesheet';
        e.type = 'text/css';
        e.href = localCss ? localCss : 'https://rawgit.com/attitude/ui-layout-grids-guides/master/ui-layout-grids-guides.css';
        w.document.body.appendChild(e);

        e = document.createElement('script');
        e.src = 'https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min.js';
        w.document.body.appendChild(e);

        e.addEventListener('load', function() {
            Mousetrap.bind('mod+;', function() {
                toggle();
            });
        }, false);

//        e = document.createElement('a');
//        e.className = 'ui-layout-guides-toggle';
//        e.addEventListener('click', toggle, false);
//        w.document.body.appendChild(e);

        attach();
    }

//    w.addEventListener('load', function () {
    init();
//    }, false);

    w.addEventListener('resize', function () {
        clearTimeout(resizeDelay);

        resizeDelay = setTimeout(function() {
            attach();
        }, 120);
    }, false);
}(window, typeof uiLayoutGridGuidesOptions === 'object' ? uiLayoutGridGuidesOptions : null, typeof uiLayoutGridGuidesLocalCss === 'string' ? uiLayoutGridGuidesLocalCss : null));
