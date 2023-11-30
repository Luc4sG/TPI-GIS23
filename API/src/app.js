const express = require('express');

const app = express();

const cors = require('cors');

// app.use(helmet());

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

const {Pool} = require('pg');

const user = 'user';
const password = 'user';
const host = 'localhost';
const port = 5432;
const database = 'sigign';

function generateWKT(coords) {
    let wkt;

    if (coords.length === 2) {
        wkt = 'POINT(' + coords[0] + ' ' + coords[1] + ')';
    } else {
        wkt = 'POLYGON((';
        for (let i = 0; i < coords.length; i++) {
            wkt += coords[i][0] + ' ' + coords[i][1];
            if (i !== coords.length - 1) {
                wkt += ', ';
            } else {
                wkt += ', ' + coords[0][0] + ' ' + coords[0][1]; // Agregar el primer punto al final para cerrar el polígono
            }
        }
        wkt += '))';
    }

    return wkt;
}


app.post('/intersect', async (req, res) => {
    console.log(req.body);
    const { Layer, coords } = req.body;
    console.log('Layer:', Layer);   
    const layersNames = [] = Layer.map((layer) => layer.sourceName);
    const wkt = generateWKT(coords);
    // if (coords.length == 2) {
    //     wkt = 'POINT(' + coords[0] + ' ' + coords[1] + ')';
    // } else {
    //     wkt = 'POLYGON((';
    //     for (var i = 0; i < coords[0].length - 1; i++) {
    //         wkt += coords[0][i][0] + ' ' + coords[0][i][1] + ',';
    //     }
    //     wkt += coords[0][0][0] + ' ' + coords[0][0][1] + '))'
    // } , ST_AsGeoJSON("'+ layer + '".geom) as features
    console.log(wkt);
    if (layersNames.length>0){
    const pool = new Pool({ 
        user
        , host
        , database
        , password
        , port
    })
    const client = await pool.connect();
    let result = {}
    try {            
        await client.query('BEGIN');
        await Promise.all(layersNames.map(async (layer) => { 
            const initialQuery =  'SELECT * FROM '+ '"'+ layer +'"';
            const query = initialQuery + ' WHERE ST_Intersects(ST_GeomFromText(\'' + wkt + '\', 4326), "' + layer+'".geom) LIMIT 5';
            console.log(query);
            const {rows} = await client.query(query);
            console.log(rows);
            result = {
                ...result,
                [layer]: {rows}
                
            }
            // const features = rows?.map((row) => {
            //     const { features, geometry, ...properties } = row;
            //     return {
            //         type: 'Feature',
            //         geometry: {
            //     ...JSON.parse(features),
            //         },
            //         properties
            //     };
            // });
            // result = { 
            //     ...result,
            //     [layer]: 
            //     {type: 'FeatureCollection', features }
            // };
        }));
        console.log(result);
        res.status(200).send(result);
    }
    catch (e) {
        await client.query('ROLLBACK');
        throw e;
    }
    finally {
        client.release();
    }
    } else {
        res.status(200).send({type: 'FeatureCollection', features: [] });
    }
});

module.exports = app;

app.post('/addMarker', async (req, res) => {
    console.log(req.body);
    const {name, description} = req.body.properties;
    const {coordenadas} = req.body.geometry.coordinates;
    const pool = new Pool({
        user: user,
        password: password,
        host: host,
        port: port,
        database: database
    });
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryText = 'INSERT INTO "Marcadores" ("nombre", "descripcion", geom) VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)) RETURNING *';
        const values = [name, description, coordenadas[0], coordenadas[1]];
        const {rows} = await client
            .query(queryText, values);
        await client.query('COMMIT');
        res.status(201).send(rows[0]);
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
});

// app.post('/removeMarkers', async (req, res) => {
//     const { coords } = req.body;
//     console.log(req.body)
//     if (!coords) {
//         res.status(400).send('Bad request');
//     }
//     let wkt = 'POLYGON((';
//     for (var i = 0; i < coords[0].length - 1; i++) {
//         wkt += coords[0][i][0] + ' ' + coords[0][i][1] + ',';
//     }
//     wkt += coords[0][0][0] + ' ' + coords[0][0][1] + '))'
//     const pool = new Pool({
//         user: user,
//         password: password,
//         host: host,
//         port: port,
//         database: database
//     });
//     const client = await pool.connect();
//     try {
//         await client.query('BEGIN');
//         const queryText = 'DELETE FROM "Marcadores" WHERE ST_Intersects(geometry, ST_GeomFromText($1, 4326))';
//         const values = [wkt];
//         const {rows} = await client
//             .query(queryText, values);
//         await client.query('COMMIT');
//         res.status(201).send(rows[0]);
//     } catch (e) {
//         await client.query('ROLLBACK');
//         throw e;
//     } finally {
//         client.release();
//     }
// });
 

// app.get('/markers', async (req, res) => {
//     const pool = new Pool({
//         user: user,
//         password: password,
//         host: host,
//         port: port,
//         database: database
//         });
//         const client = await pool.connect();
//         try {
//             await client.query('BEGIN');
//             const queryText = 'SELECT *, ST_AsGeoJSON("Marcadores".geometry) as features FROM "Marcadores"';
//             const {rows} = await client
//                 .query(queryText);
//             await client.query('COMMIT');
//             const features = rows?.map((row) => {
//                 const { features, geometry, ...properties } = row;
//                 return {
//                     type: 'Feature',
//                     geometry: {
//                 ...JSON.parse(features),
//                     },
//                     properties
//                 };
//             });
//             console.log(features);
//             res.status(200).send({type: 'FeatureCollection', features });
//         } catch (e) {
//             await client.query('ROLLBACK');
//             throw e;
//         } finally {
//             client.release();
//         }
//     });
