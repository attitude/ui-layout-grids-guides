# UI Layout Tool: Grids & Guides

Super simple inDesign-like layout grids &amp; guides overlay on any page.

Usage
-----

```html
<div id="element-to-display-grids">
    <!-- inner content -->
</div>
<!-- link the script -->
<script src="ui-layout-grids-guides.min.js"></script>
<script>
(function (w) {
    w.addEventListener('load', function () {
        // Add element to display grids; overrides the default breakpoints
        w.uiGrids.watch(document.getElementById('element-to-display-grids'), [{
            minWidth: 0,
            rules: {
                marginLeft: 32,
                marginRight: 32,
                marginTop: 32,
                marginBottom: 32,
                baselineOffset: 16,
                columns: 2,
                columnsGutter: 32,
                columnsPadding: 32
            }
        }]);
        // You can add as many breakpoints as needed
    });
}(window));
</script>
```

To display the grid hit combination of the keys, both together: `Cmd+;` on OS X or `Ctrl+;`.

### Breakpoints

- queries:
    - minWidth
    - minHeight
- rules:
    - marginLeft
    - marginRight
    - marginTop
    - marginBottom
    - baselineOffset
    - columns
    - columnsGutter
    - columnsPadding
    - maxWidth

Enjoy!

Thoughts and ideas throw at [@martin_adamko](//twitter.com/martin_adamko).
