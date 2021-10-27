const { Client } = require("@googlemaps/google-maps-services-js");
const router = require("express").Router();
const authorisation = require("../middleware/authorisation");
require('dotenv').config({ path: "../.env" } )

const client = new Client({});

router.get("/:text", authorisation, async (req, res) => {
    try {
        const { text } = req.params

        await client
            .placeAutocomplete({
                params: {
                    input: text,
                    types: 'geocode',
                    components: 'country:gb',
                    key: `${process.env.GMAPS_API}`
                },
            }).then((r) => {

                res.json(r.data.predictions)

                //above is the problem
            }).catch((e) => {
                console.log(e)
            });

    } catch (error) {
        console.log(error)
    }
});

router.get("/coords/:place_id", authorisation, async (req, res) => {
    try {
        const { place_id } = req.params
        
        await client.geocode({
            params: {
                place_id: place_id,
                key: `${process.env.GMAPS_API}`
            }
        }).then((r) => {
            
            res.json({ location: r.data.results[0].geometry.location, name: r.data.results[0].address_components[0].short_name })
            
        }).catch((e) => {
            console.log(e)
        });

    } catch (error) {
        console.log(error)
    }
});

router.post("/distance", authorisation, async (req, res) => {
    try {
        const { origin, destination } = req.body
        
        await client.directions({
            params: {
                origin: origin,
                destination: destination,
                key: `${process.env.GMAPS_API}`
            }
        }).then((r) => {
            
            // console.log(r.data.routes[0].legs[0])
            res.json(r.data.routes[0].legs[0].distance.value)
            
        }).catch((e) => {
            console.log(e)
        });

    } catch (error) {
        console.log(error)
    }
});



module.exports = router;
