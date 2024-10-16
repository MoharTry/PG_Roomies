// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//   container: 'map',
//   style:'mapbox://styles/mapbox/streets-v10',
//   center: pgroomies.geometry.coordinates,
//   zoom: 15,
// });

// map.addControl(new mapboxgl.NavigationControl());

// const marker = new mapboxgl.Marker()
//   .setLngLat(pgroomies.geometry.coordinates)
//   .addTo(map);

// const popup = new mapboxgl.Popup({ offset: 25 })
//   .setLngLat(pgroomies.geometry.coordinates)
//   .setHTML(`<h3>${pgroomies.title}</h3><p>${pgroomies.location}</p>`)
//   .addTo(map);

maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.BRIGHT,
  center: pgroomies.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

new maptilersdk.Marker()
  .setLngLat(pgroomies.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h3>${pgroomies.title}</h3><p>${pgroomies.location}</p>`
    )
  )
  .addTo(map);
