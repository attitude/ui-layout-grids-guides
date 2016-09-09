(function (w, localCss) {
    'use strict';

    var elements = [],
        guides   = [],
        visible  = false,
        screenHeight = w.document.body.parentElement.clientHeight,
        screenWidth  = w.document.body.parentElement.clientWidth,
        getElementRects = function getElementRects(element) {
            var elementRects = element.getClientRects();

            if (elementRects.length) {
                elementRects = {
                    bottom: parseInt(screenHeight - elementRects[0].bottom, 10),
                    left:   parseInt(elementRects[0].left, 10),
                    height: parseInt(elementRects[0].height, 10),
                    right:  parseInt(screenWidth - elementRects[0].right, 10),
                    top:    parseInt(elementRects[0].top, 10),
                    width:  parseInt(elementRects[0].width, 10)
                };

                return elementRects;
            }

            return null; // { bottom: 0, left: 0, height: 0, right: 0, top: 0, width: 0}
        },
        addGuide = function addGuide(elementRects, guideName, offset) {
            if (!guideName) {
                w.console.warn('Skipping guide: no name given');
                return;
            }

            if (!offset || Object.prototype.toString.call(offset) !== '[object Array]' || offset.length !== 4 || offset.indexOf('auto') < 0) {
                w.console.warn('Skipping guide: no offset given or not an array of 4 offsets');
                return;
            }

            if (!elementRects) {
                return;
            }

            var el = w.document.createElement('div');
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

            w.document.body.appendChild(el);

            guides.push(el);
        },
        addColumn = function addColumn(elementRects, guideName, top, right, bottom, left) {
            addGuide(elementRects, guideName + '-horizontal', [top || 0, right || 0, 'auto', left || 0]);
            addGuide(elementRects, guideName + '-vertical',   [top || 0, right || 0, bottom || 0, 'auto']);
            addGuide(elementRects, guideName + '-horizontal', ['auto', right || 0, bottom || 0, left || 0]);
            addGuide(elementRects, guideName + '-vertical',   [top || 0, 'auto', bottom || 0, left || 0]);
        },
        addBaselineGuide = function addBaselineGuide(elementRects, guideName, offset) {
            if (!guideName) {
                w.console.warn('Skipping guide: no name given');
                return;
            }

            if (!offset && offset !== 0) {
                w.console.warn('Skipping guide: no offset given');
                return;
            }

            if (!elementRects) {
                return;
            }

            var el = w.document.createElement('div');
            el.setAttribute('class', 'ui-layout-grids-guides-' + guideName);
            el.style.top = offset + 'px';
            el.style.left = elementRects.left + 'px';
            el.style.right = elementRects.right + 'px';

            w.document.body.appendChild(el);

            guides.push(el);
        },
        addBaselineGrid = function addBaselineGrid(elementRects, guideName, start, offset) {
            if (!guideName) {
                w.console.warn('Skipping guide: no name given');
                return;
            }

            if (!elementRects) {
                return;
            }

            if (!start) {
                start = 0;
            }

            if (!offset) {
                offset = 20;
            }

            var i;

            for (i = start; i < elementRects.height + start; i = i + offset) {
                addBaselineGuide(elementRects, guideName, i);
            }
        },
        addColumnsGrid = function addColumnsGrid(elementRects, guideName, columns, gutter, marginTop, marginRight, marginBottom, marginLeft) {
            if (!elementRects) {
                w.console.warn('Skipping columns grid: elementRects missing');
                return;
            }

            if (!guideName) {
                w.console.warn('Skipping guide: no name given');
                return;
            }

            if (columns <= 0) {
                w.console.warn('Skipping columns: no columns');
                return;
            }

            var width,
                columnWidth,
                i;

            if (!elementRects) {
                return;
            }

            columns      = parseInt(columns, 10);
            gutter       = parseInt(gutter,  10);
            gutter       = gutter >= 0 ? gutter : 0;

            width = elementRects.width - marginLeft - marginRight;

            marginTop    = parseInt(marginTop + elementRects.top,  10);
            marginRight  = parseInt(marginRight + elementRects.right, 10);
            marginBottom = parseInt(marginBottom + elementRects.bottom,  10);
            marginLeft   = parseInt(marginLeft + elementRects.left,  10);

            columnWidth = (width - ((columns - 1) * gutter)) / columns;

            if (w.console) {
                w.console.log({
                    elementRects: elementRects,
                    width: width,
                    colWidth: columnWidth,
                    columns: columns,
                    gutter: gutter,
                    marginTop: marginTop,
                    marginRight: marginRight,
                    marginBottom: marginBottom,
                    marginLeft: marginLeft
                });
            }

            for (i = 0; i < columns; i = i + 1) {
                addColumn(
                    elementRects,
                    guideName,
                    marginTop,
                    marginRight + (columnWidth + gutter) * (columns - (i + 1)),
                    marginBottom,
                    marginLeft + (columnWidth * i) + gutter * i
                );
            }
        },
        deepExtend = function deepExtend(out) {
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
        },
        attachElement = function attachElement(element) {
            var elementRects = getElementRects(element),
                optionsLength = element.uiGridsOptions.length,
                currentOptions = {},
                automargin,
                i;

            for (i = 0; i < optionsLength; i = i + 1) {
                if (!element.uiGridsOptions[i].hasOwnProperty('rules')) {
                    w.console.warn('Skipping option: missing rules attribute');
                    continue;
                }

                if (element.uiGridsOptions[i].hasOwnProperty('minWidth') && elementRects.width < element.uiGridsOptions[i].minWidth) {
                    continue;
                }

                if (element.uiGridsOptions[i].hasOwnProperty('minHeight') && elementRects.height < element.uiGridsOptions[i].minHeight) {
                    continue;
                }

                currentOptions = deepExtend(currentOptions, element.uiGridsOptions[i].rules);
            }

            if (currentOptions.hasOwnProperty('maxWidth') && elementClientWidth - currentOptions.maxWidth > currentOptions.marginLeft + currentOptions.marginRight) {
                automargin = parseInt((elementRectsClientWidth - currentOptions.maxWidth - currentOptions.marginLeft - currentOptions.marginRight) / 2, 10);
                currentOptions.marginLeft  += automargin;
                currentOptions.marginRight += automargin;
            }

            addColumnsGrid(
                elementRects,
                'column',
                (currentOptions.columns > 1 && currentOptions.columns) || 1,
                currentOptions.columnsGutter || 0,
                currentOptions.marginTop || 0,
                currentOptions.marginRight || 0,
                currentOptions.marginBottom || 0,
                currentOptions.marginLeft || 0
            );

            addColumnsGrid(
                elementRects,
                'padding',
                (currentOptions.columns > 1 && currentOptions.columns) || 1,
                (currentOptions.columnsGutter >= 0 && currentOptions.columnsPadding >= 0 && currentOptions.columnsPadding * 2 + currentOptions.columnsGutter) || 0,
                currentOptions.marginTop || 0,
                (currentOptions.marginRight >= 0 && currentOptions.columnsPadding >= 0 && currentOptions.marginRight + currentOptions.columnsPadding) || 0,
                currentOptions.marginBottom || 0,
                (currentOptions.marginLeft >= 0 && currentOptions.columnsPadding >= 0 && currentOptions.marginLeft + currentOptions.columnsPadding) || 0
            );

            addColumn(elementRects, 'margin', currentOptions.marginTop + elementRects.top || 0, currentOptions.marginRight + elementRects.right || 0, currentOptions.marginBottom + elementRects.bottom || 0, currentOptions.marginLeft + elementRects.left || 0);

            addBaselineGrid(elementRects, 'guide-baseline', elementRects.top || 0, currentOptions.baselineOffset || 20);
            addBaselineGrid(elementRects, 'guide-baseline-half', (currentOptions.marginTop || currentOptions.marginTop === 0) && currentOptions.baselineOffset && elementRects.top + currentOptions.baselineOffset / 2 || 10, currentOptions.baselineOffset || 20);
        },
        detach = function detach() {
            var l = guides.length,
                i;

            for (i = 0; i < l; i = i + 1) {
                guides[i].parentNode.removeChild(guides[i]);
            }

            guides = [];
        },
        attach = function attach() {
            if (w.console) { w.console.log('Attach!'); }

            detach();

            if (!visible) {
                return;
            }

            // Update screen dimmensions
            screenHeight = w.document.body.parentElement.clientHeight;
            screenWidth  = w.document.body.parentElement.clientWidth;

            var i,
                l = elements.length;

            for (i = 0; i < l; i += 1) {
                attachElement(elements[i]);
            }
        },
        init = function  init() {
            var e;

            e = w.document.createElement('link');
            e.rel = 'stylesheet';
            e.type = 'text/css';
            e.href = localCss || 'https://rawgit.com/attitude/ui-layout-grids-guides/master/ui-layout-grids-guides.css';
            w.document.body.appendChild(e);

            e = w.document.createElement('script');
            e.src = 'https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min.js';
            w.document.body.appendChild(e);

            e.addEventListener('load', function () {
                if (!Mousetrap) {
                    return;
                }

                Mousetrap.bind('mod+;', function () {
                    toggle();
                });
            }, false);

            e = w.document.createElement('a');
            e.className = 'ui-layout-guides-toggle';
            e.addEventListener('click', toggle, false);
            w.document.body.appendChild(e);

           attach();
        },
        toggle = function toggle() {
            if (visible) {
                w.document.body.parentElement.className = w.document.body.parentElement.className.replace(/ ui-layout-grids-guides-visible/, '');
            } else {
                w.document.body.parentElement.className += ' ui-layout-grids-guides-visible';
            }

            visible = !visible;

            attach();
        },
        defaultGrids = [
            {
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
            }
        ],
        resizeDelay;

    init();

    w.addEventListener('resize', function () {
        w.clearTimeout(resizeDelay);
        resizeDelay = w.setTimeout(attach, 120);
    }, false);

    w.uiGrids = {
        watch: function (el, options) {
            if (!options || Object.prototype.toString.call(el) !== '[object HTMLDivElement]') {
                return;
            }

            el.uiGridsOptions = options;

            if (elements.indexOf(el) < 0) {
                elements.push(el);
            }
        },
        unwatch: function (el) {
            if (Object.prototype.toString.call(el) !== '[object HTMLDivElement]') {
                return;
            }

            var i = elements.indexOf(el);

            if (i > 0) {
                elements.splice(i, 1);
            }
        }
    };
}(window, typeof uiLayoutGridGuidesLocalCss === 'string' ? uiLayoutGridGuidesLocalCss : null));
