const width = window.innerWidth;
const height = window.innerHeight;

const canvas = d3.select('canvas')
  .attr('width', width)
  .attr('height', height);

const context = canvas.node().getContext('2d');

const projection = d3.geoOrthographic()
  .translate([width / 2, height / 2])
  .scale(width / 2 - 10)
  .clipAngle(90);

const path = d3.geoPath(projection, context);

const globe = {type: 'Sphere'};

const graticule = d3.geoGraticule10();

const data = d3.range(30).map(() => {
  const coords = [Math.random() * 360 - 180, Math.random() * 180 - 90];
  return {type: 'Point', coordinates: coords};
});

d3.json('https://unpkg.com/world-atlas/world/110m.json').then(world => {
  const countries = topojson.feature(world, world.objects.countries);

  function render() {
    context.clearRect(0, 0, width, height);

    projection.rotate([Date.now() / 100, -15]);

    context.beginPath();
    path(globe);
    context.lineWidth = 2;
    context.strokeStyle = '#333';
    context.stroke();

    context.beginPath();
    path(countries);
    context.fillStyle = '#ccc';
    context.fill();

    context.beginPath();
    path(graticule);
    context.lineWidth = 0.5;
    context.strokeStyle = '#999';
    context.stroke();

    data.forEach(d => {
      const coords = projection(d.coordinates);
      context.beginPath();
      context.arc(coords[0], coords[1], 3, 0, Math.PI * 2);
      context.fillStyle = 'steelblue';
      context.fill();
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
});

