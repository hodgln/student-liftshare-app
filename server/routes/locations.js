const { Client } = require("@googlemaps/google-maps-services-js");
const router = require("express").Router();
const authorisation = require("../middleware/authorisation");
require('dotenv').config({ path: "../.env" })
const crypto = require('crypto');
const { URL } = require('url');


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
        
        console.log(origin, destination)

        await client.directions({
            params: {
                origin: origin,
                destination: destination,
                key: `${process.env.GMAPS_API}`
            }
        }).then((r) => {

            res.json({
                distance: r.data.routes[0].legs[0].distance.value,
                route: r.data.routes[0].overview_polyline.points
            })


        }).catch((e) => {
            console.log(e)
        });

    } catch (error) {
        console.log(error)
    }
});

// &signature=Ph9vKsdAYy4m-xDgtXqRWzBrsF8=

// &signature=On5WjaL7g-enyWVz92vjL3Yg3u4=

router.post("/signurl", authorisation, async (req, res) => {
    try {
        const { urlpath } = req.body

        /**
         * Convert from 'web safe' base64 to true base64.
         *
         * @param  {string} safeEncodedString The code you want to translate
         *                                    from a web safe form.
         * @return {string}
         */
        const removeWebSafe = (safeEncodedString) => {
            return safeEncodedString.replace(/-/g, '+').replace(/_/g, '/');
        }

        /**
         * Convert from true base64 to 'web safe' base64
         *
         * @param  {string} encodedString The code you want to translate to a
         *                                web safe form.
         * @return {string}
         */
        const makeWebSafe = (encodedString) => {
            //console.log(encodedString)
            return encodedString.replace(/\+/g, '-').replace(/\//g, '_');
        }

        /**
         * Takes a base64 code and decodes it.
         *
         * @param  {string} code The encoded data.
         * @return {string}
         */
        const decodeBase64Hash = (code) => {
            // "new Buffer(...)" is deprecated. Use Buffer.from if it exists.
            return Buffer.from(code, 'base64')
        }


        /**
         * Takes a key and signs the data with it.
         *
         * @param  {string} key  Your unique secret key.
         * @param  {string} data The url to sign.
         * @return {string}
         */
        const encodeBase64Hash = (key, data) => {
            const varOne = crypto.createHmac('sha1', key)
            const varTwo = varOne.update(data)
            return varTwo.digest('base64');
        }


        /**
         * Sign a URL using a secret key.
         *
         * @param  {string} path   The url you want to sign.
         * @param  {string} secret Your unique secret key.
         * @return {string}
         */
        const sign = (path, secret) => {
            const uri = new URL(path);
            const strippedUri = uri.pathname.concat(uri.search)
            const safeSecret = decodeBase64Hash(removeWebSafe(secret));
            const hashedSignature = makeWebSafe(encodeBase64Hash(safeSecret, strippedUri));
            console.log(hashedSignature)
            return uri.toString() + '&signature=' + hashedSignature;
        }

        res.json((sign(urlpath, process.env.GMAPS_STATIC_SIGNATURE)));


        //process.env.GMAPS_STATIC_SIGNATURE
    } catch (error) {
        console.log(error)
    }
});





module.exports = router;
