# grep
google autocomplete to find related words

Inspired by [The Google ‘vs’ Trick](https://medium.com/applied-data-science/the-google-vs-trick-618c8fd5359f)

## TODO

- split on 'vs' to ensure further vs become entries
  e.g. https://grep.now.sh/google%20music
  returns spotify vs apple music as a result, this should be broken into 2 items, 'spotify' and 'apple music'
- remove nested vs entries
  https://grep.now.sh/aseprite
  e.g. piskal vs mmda; graphicsgale vs piskel

- call google and generate data structure client side
  https://codesandbox.io/s/google-autocomplete-jsonp-qk2yf?file=/index.html



- listing results by number of connections will be useful

- server side rendering for meta tags
  - generate graph for search term
  - convert canvas to image
  - include as og image for cards

- clicking a connection to trigger a search on that new term

- ux
  ui inspo (email)
  text box
  search updates url for sharing
  grep.now.sh/apple

  default show a random word
  build a set of good random examples
  popular kpop band, tv shows, movies, food, etc

  bottom sheet show search
  recent search pills

  drag up reveals raw values, sorted list of words and relative value eg N/MaxN, maybe a spark bar graph under term to visualize
  color words same as nodes in graph

  organic motion effect
  randomly select nodes and drag them to random x/y
  select a random point, over time increase radius of circle from that point, as circle captures nodes, run an animation on the node like a pulse, end result should be a ripple effect that travels in a wave from point of origin

  show 1 or two levels by default
  click to expand search at that node
  eg https://vasturiano.github.io/3d-force-graph/example/expandable-nodes/

  some other great examples / inspiration
  https://github.com/vasturiano/3d-force-graph


- force graph
  https://observablehq.com/@d3/force-directed-graph

  svg force graph
  https://bl.ocks.org/jrladd/c76799aa63efd7176bd9006f403e854d
  canvas force graph
  https://bl.ocks.org/syntagmatic/954b31aa8b8beb91b30ccb0c9e57f6ce

  force graph playground
  https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03


  force graph documentation
  https://github.com/d3/d3-force


  constrain force graph to width/height bounds (tick)
  use this to keep on page (full screen bounding box)
  https://bl.ocks.org/mbostock/1129492

  fullscreen graph visualization
  bleeds out to edges of screen

  nodes colored by search depth
  nodes have word inside colored for readability
  (maybe use hsl  and lighten for font)
  may not even need links to be shown
  can try hiding or drawing very lightly
  can try clustering very tightly


