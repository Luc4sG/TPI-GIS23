import axios from 'axios'

const getIntersectedFeatures = async (layers: string[], coords: any[][]) => {
  console.log(layers,coords)
  const response = await axios.post('http://localhost:3000/intersect', {
    layers,
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