import React, {useState} from 'react';
import { fromLonLat, get, toLonLat } from "ol/proj";
import {
  RMap,
  RControl,
  RLayerTileWMS,
  RLayerWMS,
  RInteraction,
  RLayerVector,
  RStyle
} from "rlayers";
import "ol/ol.css";
import "rlayers/control/layers.css";
import './App.css'
import { RScaleLine } from "rlayers/control";
import { altKeyOnly, shiftKeyOnly } from 'ol/events/condition';
import { Coordinate } from 'ol/coordinate';
import getIntersectedFeatures from '../service/api.ts';
import Modal from './components/Modal.tsx';

interface Layer {
  sourceName: string;
}



// const layersButton = <button>&#9776;</button>;
export default function Layers(): JSX.Element {

  //Funciones ModalQuery
  const [showModal, setShowModal] = useState<boolean>(false);

  function toggleModal() {
      setShowModal(!showModal);
  }


  const layers = [
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


  function calcularVerticesDiagonales(coord1: any[], coord2: any[]): any[][] {
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
  // const coordsToString = (coords: number[]) =>
  // `${coords[1].toFixed(3)}:${coords[0].toFixed(3)}`;

  // const [layerActual, setLayerActual] = useState<string | null>(null);

  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const handleLayerChange = (selectedLayer: string): void => {
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

  const test: Object = {"ejido":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[-60.905216217,-38.341388702],[-60.908920288,-38.338977814],[-60.905334473,-38.336181641],[-60.894954681,-38.327892303],[-60.893482208,-38.329143524],[-60.888744354,-38.325035095],[-60.886806488,-38.326076508],[-60.880775452,-38.320487976],[-60.87733078,-38.322219849],[-60.87820816,-38.323272705],[-60.868267059,-38.327655792],[-60.874118805,-38.332233429],[-60.873767853,-38.332489014],[-60.877819061,-38.335704803],[-60.877933502,-38.33562851],[-60.881858826,-38.339130402],[-60.88363266,-38.337665558],[-60.886329651,-38.340419769],[-60.8957901,-38.333591461],[-60.901573181,-38.338405609],[-60.905216217,-38.341388702]]]]},"properties":{"gid":1879,"nombre":"Indio Rico","tipo":"Localidad","precisión":"Definido","esc":"Mapas Mayor e Igual a 1:1000000","signo":73004,"departamen":"Coronel Pringles","provincia":null,"fuente":"IGN","operador":"Moreno","dataset":"Localidad","fclass":"Ejido","responsabl":"Sergio Cimbaro","cargo":"Dir. Gral. Serv. Geográfico","progreso":null,"t_act":null,"coord":null,"sp":"Posgar94","datum":"WGS 84","ac":"2010","actualizac":"20101126","igds_style":0,"igds_type":0,"igds_weigh":0,"igds_color":0,"igds_level":0,"length":"0.105456119394201","shape_area":"0.000344372209606","rotation":"0.000000000000000","group":0,"coddepto":null,"codloc":null,"geom":"0106000020E6100000010000000103000000010000001500000068E9FF1FDE734EC02028FF9FB22B43C0B8D0FF7F57744EC0809900A0632B43C0F0BC0000E2734EC020CE0000082B43C00026FFDF8D724EC058FFFE5FF82943C07075FF9F5D724EC088A2FF5F212A43C09877FF5FC2714EC0D889FFBF9A2943C090EBFFDF82714EC040ED00E0BC2943C0C8BA0040BD704EC028D7FFBF052943C0D8EFFF5F4C704EC0D0C900803E2943C0D823FF1F69704EC000D5FFFF602943C0A84CFF5F236F4EC0087EFF9FF02943C088250020E36F4EC0A81800A0862A43C0287700A0D76F4EC058B400008F2A43C06866FF5F5C704EC058FFFE5FF82A43C08093FF1F60704EC0080701E0F52A43C0E8AD00C0E0704EC0A0D500A0682B43C0483000E01A714EC0304C00A0382B43C08842004073714EC02062FFDF922B43C048CAFF3FA9724EC0189CFF1FB32A43C038ACFFBF66734EC008B8FFDF502B43C068E9FF1FDE734EC02028FF9FB22B43C0"}}]}}

  var startDragBox: Coordinate

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* haceme un boton que llame al getIntersectedfeauters y le pase testlay y testcord */}
      {/* <button onClick={() => getIntersectedFeatures(testlay, testcord)}>Test</button> */}

      <div className="card">
                <span>Toggle Card</span>
                <button type="button" className="btn" onClick={toggleModal}>Open</button>
      </div>
      
      
      <RMap
        className="example-map"
        initial={{ center: fromLonLat([-57,-38]), zoom: 5 }}
        width={"80vw"}
        height={"100vh"}
      >
       
        
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

      <RLayerVector>
        <RStyle.RStyle>
          <RStyle.RStroke color="#0000ff" width={3} />
          <RStyle.RFill color="rgba(0, 0, 0, 0.75)" />
        </RStyle.RStyle>

        {/* Interacción de arrastre de caja */}
        <RInteraction.RDragBox
          condition={shiftKeyOnly}
          onBoxStart={(event) => startDragBox = event.coordinate}
          onBoxEnd={(event) => getIntersectedFeatures(selectedLayers, calcularVerticesDiagonales(toLonLat(startDragBox) ,toLonLat(event.coordinate)))} //coordsToString(toLonLat(event.coordinate)
        />
        <RInteraction.RDraw
            type={"Point"}
            condition={altKeyOnly}
          />
      </RLayerVector>


        <RScaleLine></RScaleLine>
      </RMap>
      <Modal open={showModal} onClose={toggleModal} consultLayer={test}/>
          
      <div
        className="bg-gray-500 p-3 rounded-md text-white"
        style={{
          width: '20vw', // Ancho fijo para evitar cambios al agregar leyendas
        }}
      >
        <div className="mt-3" 
        style={{
          height: '50vh',
          overflowY: 'auto',
          width: '20vw', // Ancho fijo para evitar cambios al agregar leyendas
        }}>
        <h6 className="mb-3 bg-slate-600 rounded-md p-2">Capas disponibles:</h6>
          {layers.map((layer) => (
            <div key={layer.label}>
              <input
                type="checkbox"
                id={layer.label}
                className="form-checkbox h-5 w-5 text-blue-600 accent-slate-800 cursor-pointer"
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
  )
}

// export default App

