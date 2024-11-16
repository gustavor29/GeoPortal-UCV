L.Control.ExportControl = L.Control.extend({
  onAdd: function (map) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

      // Crear íconos para los estados inactivo y activo
      const iconInactive = this.createIcon('images/icons8-descargar-inactive.png', container);
      const iconActive = this.createIcon('images/icons8-descargar-active.png', container);
      iconActive.style.display = 'none'; // Oculto inicialmente

      let drawingActive = false;
      let currentPolygon = null; // Almacenar el polígono actual

        // Evitar que el clic en el control afecte al mapa
        L.DomEvent.disableClickPropagation(container);

        container.onclick = () => {
            drawingActive = !drawingActive;
            iconInactive.style.display = drawingActive ? 'none' : 'block';
            iconActive.style.display = drawingActive ? 'block' : 'none';

            if (drawingActive) {
                this.enableDrawing(map);
            } else {
                this.disableDrawing(map);
                this.removePolygon(map); // Elimina el polígono si existe
            }
        };

        return container;
    },

    onRemove: function () {
        // Lógica de limpieza si es necesario
    },

    createIcon: function (src, container) {
        const icon = L.DomUtil.create('img', '', container);
        icon.src = src;
        icon.style.width = '30px';
        icon.style.height = '30px';
        return icon;
    },

    enableDrawing: function (map) {
        map.pm.enableDraw('Polygon', { snappable: true, snapDistance: 20 });

        // Evento que se dispara al crear el polígono
        map.on('pm:create', (e) => {
            const layer = e.layer;
            this.currentPolygon = layer; // Guarda el polígono actual
            const features = this.getFeaturesInPolygon(map, layer);
            this.exportGeoJSON(features);
        });
    },

    disableDrawing: function (map) {
        map.pm.disableDraw('Polygon');
    },

    removePolygon: function (map) {
        if (this.currentPolygon) {
            map.removeLayer(this.currentPolygon); // Elimina el polígono del mapa
            this.currentPolygon = null; // Resetea la referencia
        }
    },

    getFeaturesInPolygon: function (map, polygonLayer) {
        const polygonGeoJSON = polygonLayer.toGeoJSON();
        const features = [];

        map.eachLayer((layer) => {
            if (layer instanceof L.GeoJSON) {
                layer.eachLayer((featureLayer) => {
                    const featureGeoJSON = featureLayer.toGeoJSON();
                    if (turf.booleanIntersects(polygonGeoJSON, featureGeoJSON)) {
                        features.push(featureGeoJSON);
                    }
                });
            }
        });

        return features;
    },

    exportGeoJSON: function (features) {
        const geoJSON = { type: 'FeatureCollection', features: features };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geoJSON));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', 'exported_layers.geojson');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    }
});

// Crear una instancia del control
L.control.exportControl = function (opts) {
    return new L.Control.ExportControl(opts);
};