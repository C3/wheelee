Wheelee - a wheelee good wheel
=======

Wheelee is an interactive doughnut chart implemented using the [D3](http://d3js.org/) Javascript libary

Features include:
* Automatic rotating doughnut segment expansion
* Linked doughut legend - legend keys highlight when the segment does!
* Amazing user interaction - users are able to hover over legend items or segments to make them expand
* Plus many more hidden features

## Demo

Have a look at the demo.html file in this repo

## Example Usage

### HTML

```html
  <div id="wheelee">
    <h2>Cat popularity by breed</h2>
  </div>

  <script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
  <script type="text/javascript" src="wheelee.js" /></script>
```

### Javascript

```js
  d3.select("#wheelee").wheelify({
    'title': 'Popularity of cats by breed',
    'data': { 'Persian':    22,
              'Maine Coon': 20,
              'Exotic':     16,
              'Siamese':    13,
              'Abyssinian': 12,
              'Ragdoll':    11,
              'Birman':     6 },
    'color': '#004dec',
    'lightenGamma': 3.2 });
```

## Config

.wheelify expects the following options to be set in its configuration:
* 'title' - The title of the doughnut chart. This not a displayed heading, but is used for setting the 'title' attribute of the chart
* 'data' - An associative array of chart data. Keys represent the key or name for each segment, values represent the percentge of each segment. All values must add up to 100.
* 'color' - The start (darkest) segment color of the doughnut
* 'lightenGamma' - How much you want to lighten the start colour by. This number represents the gamma amount used to lighten the colour to reach the lightest segment. It does this using D3's 'brighter' function - see [https://github.com/mbostock/d3/wiki/Colors](https://github.com/mbostock/d3/wiki/Colors) for more informantion.

## License

Wheelee is available under [the MIT license](http://mths.be/mit).


