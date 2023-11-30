import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { fromLonLat, get, toLonLat } from "ol/proj";
import {
  RMap,
  RControl,
  RLayerTileWMS,
  RLayerWMS,
  RInteraction,
  RLayerVector,
  RStyle,
  RFeature,
  ROverlay,
} from "rlayers";
import "ol/ol.css";
import "rlayers/control/layers.css";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { RScaleLine } from "rlayers/control";
import { altKeyOnly, shiftKeyOnly, never, altShiftKeysOnly, platformModifierKeyOnly, doubleClick} from 'ol/events/condition';
import * as olCoordinate from 'ol/coordinate';
import {getIntersectedFeatures} from '../service/api.js';
import { setConsulta } from '../reducers/consultaSlice.js';
import { setCoordenadas } from '../reducers/coordenadasSlice.js';
import { useDispatch, useSelector } from 'react-redux'
import { getLength } from 'ol/sphere'
import AddMarkerInteraction from './Alert.jsx';


export default function MapaGIS(){

  const Navigate = useNavigate();

  var startDragBox;
  var carga;
  const dispatch = useDispatch();
  const count = useSelector(state => state.consulta.consulta);

  const[unique_id, setUnique_id] = useState(0);
  const[isShown, setIsShown] = useState(false);
  const[coordsMarker, setCoordsMarker] = useState([0,0]);
  

  //MODAL
  const [showModal, setShowModal] = useState(false);

  function toggleModal() {
      setShowModal(!showModal);
  }

  //COORDENADAS
  function calcularVerticesDiagonales(coord1, coord2) {
    // Coord1 y Coord2 son las coordenadas diagonales opuestas
    const x1 = coord1[0];
    const y1 = coord1[1];
    const x2 = coord2[0];
    const y2 = coord2[1];

    // Calcular las coordenadas de los vértices restantes
    const topLeft = [x1, y2];
    const topRight = [x2, y2];
    const bottomLeft = [x1, y1];
    const bottomRight = [x2, y1];

    return Array.from([topLeft, topRight, bottomLeft, bottomRight]);
  }

//Medir distancias
function calcularDistanciaEntrePuntos(coordenadas) {
  const radioTierra = 6371; // Radio de la Tierra en kilómetros
  let distanciaTotal = 0;

  //ultima coordenada
  


  for (let i = 0; i < coordenadas.length - 1; i++) {
    const [lon1, lat1] = toLonLat(coordenadas[i]);
    const [lon2, lat2] = toLonLat(coordenadas[i + 1]);

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanciaEntrePuntos = radioTierra * c;

    distanciaTotal += distanciaEntrePuntos;
  }

  // Feature.push(
  //           new Feature({ geometry: new Point(toLonLat(coordenadas.at(-1))), uid: unique_id++ })
  // );
  
  alert(`The distance between the points is: ${distanciaTotal.toFixed(2)} km`);
  return distanciaTotal;





}



function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

const [features, setFeatures] = React.useState([]);

  //LAYERS

  const layers = [
    { label: 'Marcadores', layer: 'Marcadores' },
    { label: 'actividades_agropecuarias', layer: 'Actividades Agropecuarias' },
    { label: 'actividades_economicas', layer: 'Actividades Economicas' },
    { label: 'complejo_de_energia_ene', layer: 'Complejo De Energia' },
    { label: 'curso_de_agua_hid', layer: 'Curso De Agua' },
    { label: 'curvas_de_nivel', layer: 'Curvas De Nivel' },
    { label: 'edif_construcciones_turisticas', layer: 'Edificio Construcciones Turisticas' },
    { label: 'edif_depor_y_esparcimiento', layer: 'Edificio Depor Y Esparcimiento' },
    { label: 'edif_educacion', layer: 'Edificio Educacion' },
    { label: 'edif_religiosos', layer: 'Edificio Religiosos' },
    { label: 'edificio_de_seguridad_ips', layer: 'Edificio De Seguridad' },
    { label: 'edificio_publico_ips', layer: 'Edificio Público' },
    { label: 'edificios_ferroviarios', layer: 'Edificios Ferroviarios' },
    { label: 'edificio_de_salud_ips', layer: 'Edifificio De Salud' },
    { label: 'ejido', layer: 'Ejido' },
    { label: 'espejo_de_agua_hid', layer: 'Espejos De Agua' },
    { label: 'estructuras_portuarias', layer: 'Estructuras Portuarias' },
    { label: 'infraestructura_aeroportuaria_punto', layer: 'Infraest Aeroportuaria Punto' },
    { label: 'infraestructura_hidro', layer: 'Infraestructura Hidro' },
    { label: 'isla', layer: 'Isla' },
    { label: 'limite_politico_administrativo_lim', layer: 'Limite Politico Administrativo' },
    { label: 'líneas_de_conducción_ene', layer: 'Lineas De Conduccion Ene' },
    { label: 'localidades', layer: 'Localidad' },
    { label: 'marcas_y_señales', layer: 'Marcas Y Senales' },
    { label: 'muro_embalse', layer: 'Muro Embalse' },
    { label: 'obra_portuaria', layer: 'Obra Portuaria' },
    { label: 'obra_de_comunicación', layer: 'Obras De Comunicacion' },
    { label: 'otras_edificaciones', layer: 'Otras Edificaciones' },
    { label: 'pais_lim', layer: 'Pais' },
    { label: 'puente_red_vial_puntos', layer: 'Puente Red Vial Punto' },
    { label: 'puntos_de_alturas_topograficas', layer: 'Puntos De Alturas Topograficas' },
    { label: 'puntos_del_terreno', layer: 'Puntos Del Terreno' },
    { label: 'red_ferroviaria', layer: 'Red Ferroviaria' },
    { label: 'red_vial', layer: 'Red Vial' },
    { label: 'salvado_de_obstaculo', layer: 'Salvado De Obstaculo' },
    { label: 'señalizaciones', layer: 'Señalizaciones' },
    { label: 'sue_congelado', layer: 'Suelo Congelado' },
    { label: 'sue_consolidado', layer: 'Suelo Consolidado' },
    { label: 'sue_costero', layer: 'Suelo Costero' },
    { label: 'sue_hidromorfologico', layer: 'Suelo Hidromorfologico' },
    { label: 'sue_no_consolidado', layer: 'Suelo No Consolidado' },
    { label: 'veg_arborea', layer: 'Vegetación Arborea' },
    { label: 'veg_arbustiva', layer: 'Vegetación Arbustiva' },
    { label: 'veg_cultivos', layer: 'Vegetación Cultivos' },
    { label: 'veg_hidrofila', layer: 'Vegetación Hidrofila' },
    { label: 'veg_suelo_desnudo', layer: 'Vegetación Suelo Desnudo' },
    { label: 'vias_secundarias', layer: 'Vias Secundarias' }
  ];

  const [selectedLayers, setSelectedLayers] = useState([]);
  const handleLayerChange = (selectedLayer) => {
    // Toggle la capa seleccionada (agrega o elimina de la lista)
    setSelectedLayers((prevSelectedLayers) => {
      const isSelected = prevSelectedLayers.includes(selectedLayer);
      if (isSelected) {
        // Si ya estaba seleccionada, la eliminamos
        return prevSelectedLayers.filter((layer) => layer !== selectedLayer);
      } else {
        // Si no estaba seleccionada, la agregamos
        return [...prevSelectedLayers, selectedLayer];
      }
    });
  };

 
  return (
    <div>
    <AddMarkerInteraction isShown={isShown} setIsShown={()=>setIsShown(false)} />
    <div style={{ display: 'flex', flexDirection: 'row' }}>
    <RMap
        className="example-map"
        initial={{ center: fromLonLat([-57,-38]), zoom: 5 }}
        width={"80vw"}
        height={"100vh"}
        onDblClick={(e) => {
          const coords = e.map.getCoordinateFromPixel(e.pixel);
          let aux = toLonLat(coords)
          dispatch(setCoordenadas(aux))
          console.log(aux);
          setUnique_id(unique_id + 1);
          features.push(
            new Feature({ geometry: new Point(coords), uid: unique_id})
          
          );
          setIsShown(true);
          setFeatures([...features]);
        }}>
        {/* LAYERS */}
         <RLayerTileWMS
            properties={{ label: "layer" }}
            url='https://wms.ign.gob.ar/geoserver/ows'
            params={{
              LAYERS: 'capabaseargenmap',
              FORMAT: "image/jpeg",
              serverType: "mapserver",
            }}
          />
          <RLayerTileWMS
                 properties={{ label: "yis" }}
                 url='http://localhost/cgi-bin/qgis_mapserv.fcgi?map=/usr/local/share/qgis/tpigis.qgz'
                 params={{
                   LAYERS: selectedLayers,
                   FORMAT: "image/png",
                   serverType: "mapserver",
                 }}
          />
          {/* INTERACCIONES */}
          <RInteraction.RDragBox
          condition={shiftKeyOnly}
          onBoxStart={(event) => startDragBox = event.coordinate}
          onBoxEnd={(event) => getIntersectedFeatures(selectedLayers, calcularVerticesDiagonales(toLonLat(startDragBox) ,toLonLat(event.coordinate))).then((response) => {
            dispatch(setConsulta(JSON.stringify(response)))
            toggleModal()
            console.log(response)
            console.log(count)
            Navigate('/consulta')
          })} //coordsToString(toLonLat(event.coordinate)
        />
        <RLayerVector>

        <RStyle.RStyle>
            <RStyle.RIcon src={"https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-32.png"} />
          </RStyle.RStyle>
          {features.map((f) => (
            <RFeature
              key={f.get("uid")}
              feature={f}
              doubleClick={(e) => {
                const idx = features.findIndex(
                  (x) => x.get("uid") === e.target.get("uid")
                );
                if (idx >= 0) {
                  features.splice(idx, 1);
                  setFeatures([...features]);
                  return false;
                }
                
              }}
              
            >
              <ROverlay>
                <div className={"user-select-none"}>{f.get("uid")}</div>         
              </ROverlay>
            </RFeature>
          ))}

          <RInteraction.RDraw
            type={"LineString"}
            condition={platformModifierKeyOnly}
            freehandCondition={never}
            onDrawEnd={(e) => {
    const distance = calcularDistanciaEntrePuntos(e.target.sketchCoords_).then((r) => {});
            }}
          />
          {/* <RInteraction.RModify
            condition={platformModifierKeyOnly}
            deleteCondition={React.useCallback(
              (e) => platformModifierKeyOnly(e) && doubleClick(e),
              []
            )}
          /> */}
          
        </RLayerVector>
        
    <RScaleLine></RScaleLine>
    </RMap>

    <div
        style={{
          width: '20vw', // Ancho fijo para evitar cambios al agregar leyendas
        }}
      >
        <div
        style={{
          height: '50vh',
          overflowY: 'auto',
          width: '20vw', // Ancho fijo para evitar cambios al agregar leyendas
        }}>
        <h2>Capas disponibles:</h2>
          {layers.map((layer) => (
            <div key={layer.label}>
              <input
                type="checkbox"
                id={layer.label}
                checked={selectedLayers.includes(layer.label)}
                onChange={() => handleLayerChange(layer.label)}
              />
              <label htmlFor={layer.label}>{layer.layer}</label>
            </div>
          ))}
        </div>

        <div
        style={{
          borderTop: '1px solid Black',
          height: '49vh',
          overflowY: 'auto',
          width: '20vw', // Ancho fijo para evitar cambios al agregar leyendas
        }}>
          {selectedLayers.map((selectedLayer) => (
             <div key={selectedLayer} style={{ marginBottom: '10px' }}>
             <img
               src={`http://localhost/cgi-bin/qgis_mapserv.fcgi?map=/usr/local/share/qgis/tpigis.qgz&SERVICE=WMS&REQUEST=GetLegendGraphic&LAYER=${selectedLayer}&FORMAT=image/png`}
               alt={`Legend for ${selectedLayer}`}
             />
           </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}





// export default function Layers() {


//   //Layers disponibles








//
//   var startDragBox

//   return (
//     <div style={{ display: 'flex', flexDirection: 'row' }}>

//       {/* <div className="card">
//                 <span>Toggle Card</span>
//                 <button type="button" className="btn" onClick={toggleModal}>Open</button>
//       </div> */}


//       <RMap
//         className="example-map"
//         initial={{ center: fromLonLat([-57,-38]), zoom: 5 }}
//         width={"80vw"}
//         height={"100vh"}
//       >


        // <RLayerTileWMS
        //     properties={{ label: "layer" }}
        //     url='https://wms.ign.gob.ar/geoserver/ows'
        //     params={{
        //       LAYERS: 'capabaseargenmap',
        //       FORMAT: "image/jpeg",
        //       serverType: "mapserver",
        //     }}
        //   />



//       <RLayerVector>
//         <RStyle.RStyle>
//           <RStyle.RStroke color="#0000ff" width={3} />
//           <RStyle.RFill color="rgba(0, 0, 0, 0.75)" />
//         </RStyle.RStyle>

//         {/* Interacción de arrastre de caja */}

//         <RInteraction.RDraw
//             type={"Point"}
//             condition={altKeyOnly}
//           />
//       </RLayerVector>


//         <RScaleLine></RScaleLine>
//       </RMap>
//       {/*  */}


//   )
// }

// // export default App

