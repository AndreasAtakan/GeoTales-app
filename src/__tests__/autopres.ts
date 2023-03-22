import { Pres, V2, bbox_sphere, V3, OT, Img } from '../autopres';
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
                    timestamp: 0,
                })
            );
        }
    }
    return imgs;
}

it("test", () => {
    let imgs = make_test_imgs(200, 12, 0.1);
    let ot = new OT<Img>(bbox_sphere(new V3(0, 0, 0), 6378137), 1, 1);
    for (let img of imgs) {
        let [lat, lng] = img.pos;
        ot.insert_coord(lat, lng, img);
    }
    for (let cluster of ot.collect()) {
        let pos_arr = cluster.map(x => x.pos);
        console.log(pos_arr);
    }
    fs.writeFile('test-out/box-corners.csv', ot.collect_box_corners_csv(), () => {});
});
