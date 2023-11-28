import axios from 'axios'

interface Layer {
  sourceName: string;
}



const getIntersectedFeatures = async (layers: string[],
  coords: any[][]) => {
  console.log(layers,coords)

  const Layer: Layer[] = layers.map((layer) => {
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

// Corrección: exportar la función por defecto
export default getIntersectedFeatures;