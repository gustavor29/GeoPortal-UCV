// Inicializa el control de dibujo
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  },
  draw: {
    polygon: {
      allowIntersection: false, // No permitimos intersecciones
      showArea: false,           // Deshabilitar la visualización de área
      metric: ['km'],            // Define la unidad métrica, si fuera necesario
      shapeOptions: {
        color: '#ff6666'
      }
    },
    polyline: false, // Deshabilitamos otras formas
    rectangle: false,
    circle: false,
    marker: false,
    circlemarker: false
  }
});
map.addControl(drawControl);

// Evento que se activa cuando se dibuja un polígono
map.on(L.Draw.Event.CREATED, function (e) {
  var type = e.layerType,
      layer = e.layer;

  if (type === 'polygon') {
    drawnItems.addLayer(layer);

    // Aquí definimos 'polygonGeoJSON' tomando el polígono dibujado
    var polygonGeoJSON = layer.toGeoJSON();

    // Aquí almacenaremos solo las capas vectoriales dentro o intersectando el polígono
    var featuresInPolygon = [];

    // Recorremos las capas vectoriales activas
    map.eachLayer(function (mapLayer) {
      if (mapLayer instanceof L.GeoJSON) {
        // Recorremos las características del GeoJSON
        mapLayer.eachLayer(function (vectorLayer) {
          // Convertimos el polígono y la capa a objetos de Turf.js
          var layerGeoJSON = vectorLayer.toGeoJSON();

          // Verificamos si intersecta con el polígono dibujado usando Turf.js
          var intersection = turf.intersect(polygonGeoJSON, layerGeoJSON);
          if (intersection) {
            featuresInPolygon.push(layerGeoJSON);
          }
        });
      }
    });

    // Creamos un nuevo objeto GeoJSON con las capas dentro del polígono
    var finalGeoJSON = {
      type: "FeatureCollection",
      features: featuresInPolygon // Excluimos el polígono dibujado
    };

    // Descarga el archivo GeoJSON
    downloadGeoJSON(finalGeoJSON);
  }
});
