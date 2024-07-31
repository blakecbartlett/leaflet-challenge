const geoJSONLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Step 1: Use D3 to fetch the GeoJSON data
d3.json(geoJSONLink)
  .then(function(data) {
    createMap(data);
  });

// Step 2: Create a Leaflet map
function createMap(data) {
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

  // Step 3: Add a base tile layer from OpenStreetMap to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(myMap);

  // Step 4: Add a GeoJSON layer to the map
  addGeoJSONLayer(data, myMap);
}

// Step 4: Add a GeoJSON layer to the map
function addGeoJSONLayer(data, map) {
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      let radius = feature.properties.mag * 5;
      let depth = feature.geometry.coordinates[2];
      let color = getColor(depth);

      return L.circleMarker(latlng, {
        radius: radius,
        fillColor: color,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
  }).addTo(map);

  // Step 5: Create a legend
  createLegend(map);

}

// Step 5: Create a legend
function createLegend(map) {
    let legend = L.control({ position: "bottomright" });
    
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
            let depths = [-10, 10, 30, 50, 70, 90];
            let colors = ["#98EE00", "#D4EE00", "#EECC00", "#EE9C00", "#EA822C", "#EA2C2C"];
            let labels = [];
        
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML += "<i class='circle' style='background: " + colors[i] + "'></i> " + depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
        }
        
        console.log(div.innerHTML);
        return div;
    };
    
    legend.addTo(map);
}

// Function to get color based on depth
function getColor(depth) {
  let color;
  if (depth > 90) {
    color = "#EA2C2C";
  } else if (depth > 70) {
    color = "#EA822C";
  } else if (depth > 50) {
    color = "#EE9C00";
  } else if (depth > 30) {
    color = "#EECC00";
  } else if (depth > 10) {
    color = "#D4EE00";
  } else {
    color = "#98EE00";
  }
  return color;
}