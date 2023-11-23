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
import { shiftKeyOnly } from 'ol/events/condition';
import { Coordinate } from 'ol/coordinate';


// const layersButton = <button>&#9776;</button>;
export default function Layers(): JSX.Element {

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
  function calcularVerticesDiagonales(coord1: any[], coord2: any[]) {
    // Coord1 y Coord2 son las coordenadas diagonales opuestas
    const x1 = coord1[0];
    const y1 = coord1[1];
    const x2 = coord2[0];
    const y2 = coord2[1];
  
    // Calcular las coordenadas de los vértices restantes
    const topLeft = `${x1} ${y2}`;
    const topRight = `${x2} ${y2}`;
    const bottomLeft = `${x1} ${y1}`;
    const bottomRight = `${x2} ${y1}`;

    return `${topLeft}, ${topRight}, ${bottomLeft}, ${bottomRight}`;
  }
  const coordsToString = (coords: number[]) =>
  `${coords[1].toFixed(3)}:${coords[0].toFixed(3)}`;

  const [layerActual, setLayerActual] = useState<string | null>(null);

  const handleLayerChange = (selectedLayer: string) => {
    setLayerActual(selectedLayer);
  };


  var startDragBox: Coordinate

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
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
                   LAYERS: layerActual,
                   FORMAT: "image/png",
                   serverType: "mapserver",
                 }}
               />
        {/* <RControl.RLayers element={layersButton} >
          {layers.map((layer) => (
            <RLayerTileWMS properties={{label:layer.layer}} 
              url='http://localhost/cgi-bin/qgis_mapserv.fcgi?map=/usr/local/share/qgis/tpigis.qgz'
              
              params={{
                LAYERS: layer.label,
                FORMAT: "image/png",
                serverType: "mapserver",
              }}
              onTileLoadStart={() => handleLayerChange(layer.label)}
              />
              
              ))}
        </RControl.RLayers> */}
       

         {/* <RLayerWMS properties={{label:"Ni idea" }}
                url='http://localhost/cgi-bin/qgis_mapserv.fcgi?map=/usr/local/share/qgis/tpigis.qgz'
                
                params={{
                  SERVICE: 'WMS',
                  REQUEST: 'GetLegendGraphic',
                  LAYERS: layerActual,
                  FORMAT: "image/png",
                  SCALE: 0,
                  serverType: "mapserver",
                }}
                />
             */}

      <RLayerVector>
        <RStyle.RStyle>
          <RStyle.RStroke color="#0000ff" width={3} />
          <RStyle.RFill color="rgba(0, 0, 0, 0.75)" />
        </RStyle.RStyle>

        {/* Interacción de arrastre de caja */}
        <RInteraction.RDragBox
          condition={shiftKeyOnly}
          onBoxStart={(event) => startDragBox = event.coordinate}
          onBoxEnd={(event) => console.log( calcularVerticesDiagonales(toLonLat(startDragBox) ,toLonLat(event.coordinate)))} //coordsToString(toLonLat(event.coordinate)
        />
      </RLayerVector>


        <RScaleLine></RScaleLine>
      </RMap>
      <div className='bg-gray-500 p-3 rounded-md text-white' style={{ height: '100vh' }}>
      <h6 className='mb-3 bg-slate-600 rounded-md p-2'>
        Capas disponibles:
      </h6>
      <div className='overflow-auto sm:h-60 h-40' style={{ height: '60vh', overflowY: 'auto' }}>
        {layers.map((layer) => (
          <div key={layer.label}>
            <input
              type='radio'
              id={layer.label}
              name='layerGroup'
              className='form-radio h-5 w-5 text-blue-600 accent-slate-800 cursor-pointer'
              checked={layer.label === layerActual}
              onChange={() => handleLayerChange(layer.label)}
            />
            <label htmlFor={layer.label}>{layer.layer}</label>
          </div>
        ))}
      </div>
    <div className='mt-3'>
    {layerActual && (
      <img
        src={`http://localhost/cgi-bin/qgis_mapserv.fcgi?map=/usr/local/share/qgis/tpigis.qgz&SERVICE=WMS&REQUEST=GetLegendGraphic&LAYER=${layerActual}&FORMAT=image/png`}
        alt={`Legend for ${layerActual}`}
      />
    )}
  </div>
    </div>
    </div>
  )
}


// export default App



