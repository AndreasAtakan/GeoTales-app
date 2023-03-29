import { Pres, V2, bbox_sphere, trip_finder, V3, OT, Img } from '../autopres';
const fs = require('fs');

function random_coords(): V2 {
    return new V2(Math.random()*360 - 180, Math.random()*360 - 180);
}

/** Return `n` test images, with clusters up to size `r` with deviation `d`
 * between cluster elements. */
function make_test_imgs(n: number, r: number, d: number): Img[] {
    let imgs = [];
    for (let i = 0; i < n; i++) {
        let k = 1+Math.floor(Math.random()*r);
        // Generate random point
        let pos = random_coords();
        // Let the point meander a bit around `k`<`r` times
        for (let j = 0; j < k; j++) {
            let q = Math.random();
            let [lat, lng] = (pos = pos.add((new V2(q, 1 - q)).scale(d))).to_a();
            imgs.push(
                new Img({
                    location: {
                        latitude: lat,
                        longitude: lng,
                    },
                    image: {
                        uri: "file:/dev/null",
                        width: 1,
                        height: 1,
                    },
                    timestamp: i*j,
                })
            );
        }
    }
    return imgs;
}

it("test", () => {
    let imgs = make_test_imgs(200, 12, 0.1);
    let trips = trip_finder(imgs);
    console.log(`number of images: ${imgs.length}`);
    console.log(`number of trips: ${trips.length}`);
    // for (let cluster of trips) {
    //     let pos_arr = cluster.imgs.map(x => x);
    //     console.log(pos_arr);
    // }
});
