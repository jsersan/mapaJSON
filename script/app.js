let mapa;
let markers = [];

// Fichero JSON con las capitales de Euskadi
let fichero = 'datoscapitales.json';
let data;

window.onload = function() {
    // Cargamos el fichero mediante AJAX
    cargarFichero(fichero);
}

function cargarFichero(fichero) {

    // Función AJAX para cargar un fichero JSON
    let xhr = new XMLHttpRequest();
    let datos;
    xhr.open("GET", fichero, true);

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            datos = JSON.parse(this.responseText);
            initMap();

            // Le pasanos a la función colocarPines los datos con las localizaciones de las capitales
            colocarPines(datos);
            console.log(datos);
        }
    };
    xhr.send();
}

function initMap() {

    // Función que crea el mapa
    const LatLong = {
        lat: 43.2603479,
        lng: -2.933411
    };

    this.mapa = new google.maps.Map(document.getElementById("mapa"), {
        center: LatLong,
        zoom: 9
    });

    return;
}

function colocarPines(data) {
    let lat;
    let lng;
    let nombre;
    let infoWindowActivo;

    //Solo tomamos el pin de las capitales

    var iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
    var icons = {
        capital: {
            name: "capital",
            icon: iconBase + "capital_big_highlight.png"
        }
    };

    // Recorremos la data para pintar cada una de las localizaciones

    data.forEach(element => {
        lat = element.latwgs84;
        lng = element.lonwgs84;
        nombre = element.documentName;
        provincia = element.territory;
        descripcion = element.touristmDescription;

        // Cambiamos a notración europea por si acaso

        if (lat != null || lng != null) {
            lat = lat.replace(",", ".");
            lng = lng.replace(",", ".");
        }

        // Las coordenadas serán el punto formado por la latitud y la longitud

        const coordenadas = {
            lat: Number(lat),
            lng: Number(lng),
            tipo: "capital"
        };


        // El icono es de tipo capital como indica el objeto coordenadas

        let icono = icons[coordenadas.tipo];
        if (icono !== undefined) {
            icono = icono.icon;
        }

        // Ciolocamos cada una de las posiciones
        let marker = new google.maps.Marker({
            position: coordenadas,
            map: this.mapa,
            icon: icono,
        });
        markers.push(marker);

        // Asociamos una ventana de información a cada uno
        let infoWindow = crearInfoWindow(
            nombre,
            descripcion
        );

        // Asociamos el evento click a cada marca de como que si hacenos click en cada uno eparecerá una ventana de información
        // Utilizamos la variable infoWindowActivo ya que sólo quiero una ventana de información en cada momento
        marker.addListener("click", () => {
            if (infoWindowActivo) {
                infoWindowActivo.close();
            }

            infoWindow.open(this.mapa, marker);
            infoWindowActivo = infoWindow;
        });
    });

    return;
}

function crearInfoWindow(nombre, descripcion) {

    let markerInfo = `<h1>${nombre}</h1> 
        <br><b>Descripcion</b>: ${descripcion}</br>
        `;

    infoWindow = new google.maps.InfoWindow({
        content: markerInfo
    });

    return infoWindow;
}