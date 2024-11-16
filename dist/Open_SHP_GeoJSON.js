/* Primero, asegúrate de incluir las bibliotecas necesarias en tu proyecto:*/

<script src="https://unpkg.com/shpjs"></script>

/* Luego, crea una función que se encargue de leer y mostrar los archivos SHP y GeoJSON en el mapa:*/

function cargarArchivoShp(mapa, archivo) {
  shp(archivo).then(function(data) {
    L.geoJson(data).addTo(mapa);
  });
}

function cargarArchivoGeojson(mapa, archivo) {
  fetch(archivo)
    .then(response => response.json())
    .then(data => {
      L.geoJson(data).addTo(mapa);
    });
}

/* Por último, crea un control personalizado en Leaflet que permita al usuario cargar archivos SHP y GeoJSON:*/

L.Control.FileLoader = L.Control.extend({
  onAdd: function(map) {
    var container = L.DomUtil.create('div', 'leaflet-control-fileloader leaflet-bar');

    container.innerHTML = '<input type="file" accept=".shp,.geojson">';

    container.firstChild.onchange = function(e) {
      var file = e.target.files[0];

      if (file.name.endsWith('.shp')) {
        cargarArchivoShp(map, file);
      } else if (file.name.endsWith('.geojson')) {
        cargarArchivoGeojson(map, URL.createObjectURL(file));
      }
    };

    return container;
  },

  onRemove: function() {}
});

L.control.fileLoader = function(opts) {
  return new L.Control.FileLoader(opts);
};

L.control.fileLoader({ position: 'topright' }).addTo(map);

/* Con este código, ahora tendrás un control en tu mapa Leaflet que permitirá al usuario cargar archivos SHP y GeoJSON para visualizarlos en el mapa. ¡Espero que esta información te sea útil! */