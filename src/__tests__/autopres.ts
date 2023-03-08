import { Pres, Img, V2, bbox_sphere, V3, OT } from '../autopres';

function random_coords(): V2 {
    return new V2(Math.random()*180 - 90, Math.random()*180 - 90);
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
            imgs.push(
                new Img({
                    image: {
                        location: (pos = pos.add((new V2(q, 1 - q)).scale(d))).to_a(),
                        width: 1,
                        height: 1,
                        uri: "file:/dev/null",
                        timestamp: 0,
                    }
                })
            );
        }
    }
    return imgs;
}

it("test", () => {
    let imgs = make_test_imgs(10, 6, 0.001);
    let ot = new OT(bbox_sphere(new V3(0, 0, 0), 1000000), 1, 1);
    for (let img of imgs) {
        let [lat, lng] = img.pos;
        console.log(`insert_coord: ${lat}, ${lng}`);
        ot.insert_coord(lat, lng);
    }
});
