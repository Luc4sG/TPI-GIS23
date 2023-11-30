import axios from 'axios'




export const getIntersectedFeatures = async (layers,
  coords) => {
  console.log(layers,coords)

  const Layer = layers.map((layer) => {
    return { sourceName: layer };
  } );

  const response = await axios.post('http://localhost:3000/intersect', {
    Layer,
    coords
  },{
    headers: {
        'Content-Type': 'application/json',
    },
});

  return response.data;
};

export const postMarker = async (marker) => {

const response = await axios.post('http://localhost:3000/addMarker', marker)
return response.data
};
// Corrección: exportar la función por defecto
export default {getIntersectedFeatures, postMarker};