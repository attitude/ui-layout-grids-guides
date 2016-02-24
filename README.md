# UI Layout Tool: Grids & Guides

Super simple inDesign-like layout grids &amp; guides overlay on any page.

Usage
-----

```js
<script>
  // Override default breakpoints
  uiLayoutGridGuidesOptions = [{
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
   }];
   // You can add as many breakpoints as needed
</script>
<script src="ui-layout-grids-guides.js"></script>
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
