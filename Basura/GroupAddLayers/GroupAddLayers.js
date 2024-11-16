// Crear control de carga de GeoTIFF personalizado

var LoadRasterControl = L.Control.extend({
	options: {
		position: 'topright'
	},
	onAdd: function(map) {
		var container = L.DomUtil.create('div', 'leaflet-control-load-raster');
		var label = L.DomUtil.create('label', '', container);
		var icon = L.DomUtil.create('i', 'fas fa-satellite', label);
		var text = document.createTextNode('Raster');
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
					// Contraer el control contenedor del grupo
					groupContainer.classList.remove('expanded');
				};
				reader.readAsArrayBuffer(file);
			}
		});

		return container;
	}
});

// Crear control de carga de GeoJSON y Shapefile personalizado
var LoadGeoJSONShapefileControl = L.Control.extend({
	options: {
		position: 'topright'
	},
	onAdd: function(map) {
		var container = L.DomUtil.create('div', 'leaflet-control-load-geojson-shapefile');
		var label = L.DomUtil.create('label', '', container);
		var icon = L.DomUtil.create('i', 'fas fa-draw-polygon', label);
		var text = document.createTextNode('Vector');
		var input = L.DomUtil.create('input', '', label);
		input.type = 'file';
		input.accept = '.geojson,.json,.shp';
		label.appendChild(icon);
		label.appendChild(text);

		input.addEventListener('change', function(event) {
			var file = event.target.files[0];
			if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
				var reader = new FileReader();
				reader.onload = function(e) {
					var geojson = JSON.parse(e.target.result);
					L.geoJSON(geojson).addTo(map);
					// Contraer el control contenedor del grupo
					groupContainer.classList.remove('expanded');
				};
				reader.readAsText(file);
			} else if (file.name.endsWith('.shp')) {
				var reader = new FileReader();
				reader.onload = function(e) {
					var arrayBuffer = e.target.result;
					shapefile.open(arrayBuffer).then(function(source) {
						return source.read().then(function log(result) {
							if (result.done) return;
							L.geoJSON(result.value).addTo(map);
							// Contraer el control contenedor del grupo
							groupContainer.classList.remove('expanded');
							return source.read().then(log);
						});
					});
				};
				reader.readAsArrayBuffer(file);
			}
		});

		return container;
	}
});

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

// Crear el control de grupo personalizado
L.Control.GroupAddLayers = L.Control.extend({
	options: {
		position: 'topright'
	},
	onAdd: function(map) {
		groupContainer = L.DomUtil.create('div', 'leaflet-control-group');
		var icon = L.DomUtil.create('img', ' ', groupContainer);
        icon.src = './dist/GroupAddLayers/layer-add.svg'; // Ruta de la imagen SVG
		var tooltip = L.DomUtil.create('div', 'tooltip', groupContainer);
		tooltip.innerHTML = 'Agregar Capas';
		var controls = L.DomUtil.create('div', 'controls', groupContainer);

		// Agregar subcontroles
		controls.appendChild(new LoadRasterControl().onAdd(map));
		controls.appendChild(new LoadGeoJSONShapefileControl().onAdd(map));

		// Manejador de mouse para expandir/contraer el grupo de controles
		groupContainer.addEventListener('mouseenter', function() {
			groupContainer.classList.add('expanded');
		});
		groupContainer.addEventListener('mouseleave', function() {
			groupContainer.classList.remove('expanded');
		});

		return groupContainer;
	}
});

L.control.groupAddLayers = function(options) {
        return new L.Control.GroupAddLayers(options);
    };