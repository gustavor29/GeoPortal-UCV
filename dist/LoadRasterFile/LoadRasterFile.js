L.Control.LoadRasterControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-load-raster');
        var label = L.DomUtil.create('label', '', container);
        var icon = L.DomUtil.create('i', 'fas fa-file-upload', label);
        var text = document.createTextNode(' Cargar GeoTIFF');
        var input = L.DomUtil.create('input', '', label);
        input.type = 'file';
        input.accept = '.tif,.tiff';

        label.appendChild(icon);
        label.appendChild(text);

        input.addEventListener('change', function(event) {
            var file = event.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var arrayBuffer = e.target.result;
                    parseGeoTIFF(arrayBuffer);
                };
                reader.readAsArrayBuffer(file);
            }
        });

        return container;
    }
});

// Agregar el control de carga de raster personalizado al mapa

function parseGeoTIFF(arrayBuffer) {
    parseGeoraster(arrayBuffer).then(georaster => {
        var layer = new GeoRasterLayer({
            georaster: georaster,
            opacity: 0.7,
            resolution: 256 // optional parameter for adjusting display resolution
        });
        map.fitBounds(layer.getBounds());
        layer.addTo(map);
    });
}
L.control.loadRasterControl = function(options) {
    return new L.Control.LoadRasterControl(options);
};