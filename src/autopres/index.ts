import { distance } from "@turf/turf";

import uuid from "../utils/uuid";

const POS_ZERO = [8, 50];
const IMG_RADIUS = 0.001;

export class Img {
    id: string = uuid();
    pos: number[];
    uri: string;
    timestamp: number;
    ratio: number;

    constructor(img: ImageAsset, pos_zero?: number[]) {
        this.uri = img.image.uri;
        this.timestamp = img.timestamp; // NOTE: is already in epoch-time
        this.ratio = img.image.width / img.image.height;

        let l = img.location;
        this.pos = l ? [l.longitude, l.latitude] : pos_zero || POS_ZERO;
    }
}

/** Presentation */
export class Pres {
    clusters: ImgCluster[] = [];
    imgs: Img[] = [];
    slide: number = 0;

    /**
     * Parameters:
     *   - `imgs`: Images to construct presentation from
     *   - `d`: Maximum radius of image cluster in kilometers
     */
    constructor(imgs: ImageAsset[], d: number, pos_zero?: number[]) {
        let l: Img[] = imgs.map(i => new Img(i, pos_zero));
        l.sort((u, v) => u.timestamp - v.timestamp);
        this.clusters = clusterize(l, d);
        this.imgs = l;
    }

    next() {
        this.slide += 1
    }

    prev() {
        this.slide -= 1
    }
}

export class V2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `[${this.x}, ${this.y}]`;
    }

    add(o: V2): V2 {
        return new V2(this.x + o.x, this.y + o.y);
    }

    sub(o: V2): V2 {
        return new V2(this.x - o.x, this.y - o.y);
    }

    scale(s: number): V2 {
        return new V2(this.x * s, this.y * s);
    }

    len(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    to_a(): number[] {
        return [this.x, this.y];
    }
}


export class V3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toString() {
        return `[${this.x}, ${this.y}, ${this.z}]`;
    }

    add(o: V3): V3 {
        return new V3(this.x + o.x, this.y + o.y, this.z + o.z);
    }

    to_a(): number[] {
        return [this.x, this.y, this.z];
    }

    sub(o: V3): V3 {
        return new V3(this.x - o.x, this.y - o.y, this.z - o.z);
    }

    scale(s: number): V3 {
        return new V3(this.x * s, this.y * s, this.z * s);
    }

    len(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}

function radians(degs: number): number {
    return degs * (Math.PI/180);
}

/** Convert a latitude,longitude pair to ecef coordinates */
function latlng_to_ecef(rad: number, lat: number, lng: number, alt?: number): V3 {
    // For more information, see:
    //   https://se.mathworks.com/help/aeroblks/llatoecefposition.html
    //   https://www.oc.nps.edu/oc2902w/coord/llhxyz.htm
    lat = radians(lat);
    lng = radians(lng);
    if (!alt) alt = 0;
    // let rad = 6378137;
    let f = 1/298.257223563;
    let cos_lat = Math.cos(lat);
    let sin_lat = Math.sin(lat);
    let ff = Math.pow(1-f, 2);
    let c = 1/Math.sqrt(Math.pow(cos_lat, 2) + ff * Math.pow(sin_lat, 2));
    let s = c * ff;
    let x = (rad * c + alt)*cos_lat * Math.cos(lng);
    let y = (rad * c + alt)*cos_lat * Math.sin(lng);
    let z = (rad * s + alt)*sin_lat;
    return new V3(x, y, z);
}

export class BBox3 {
    min: V3;
    max: V3;
    core: V3;

    constructor(min: V3, max: V3) {
        this.min = min;
        this.max = max;
        this.core = max.sub(min).scale(0.5).add(min);
    }

    explode(): BBox3[] {
        // Unit vectors to move boxes along
        let xhat = new V3((this.max.x - this.min.x) / 2, 0, 0);
        let yhat = new V3(0, (this.max.y - this.min.y) / 2, 0);
        let zhat = new V3(0, 0, (this.max.z - this.min.z) / 2);

        let ba = new BBox3(this.min, this.core);
        let bb = ba.add(yhat);
        let bc = bb.add(xhat);
        let bd = ba.add(xhat);
        let be = ba.add(zhat);
        let bf = be.add(yhat);
        let bg = bf.add(xhat);
        let bh = be.add(xhat);

        return [ba, bb, bc, bd, be, bf, bg, bh];
    }

    add(d: V3): BBox3 {
        return new BBox3(this.min.add(d), this.max.add(d));
    }

    width(): number {
        return this.max.x - this.min.x;
    }

    radius(): number {
        return this.width() / 2;
    }

    includes(p: V3) {
        return (
            p.x >= this.min.x && p.x <= this.max.x &&
            p.y >= this.min.y && p.y <= this.max.y &&
            p.z >= this.min.z && p.z <= this.max.z
        )
    }
}

export function bbox_sphere(ct: V3, r: number): BBox3 {
    let rv = new V3(r, r, r);
    let min = ct.sub(rv);
    let max = ct.add(rv);
    return new BBox3(min, max);
}

class OTNode {
    nodes: (OTNode | null)[];
    pts: V3[] | null;
    bbox: BBox3;

    constructor(bbox: BBox3) {
        this.nodes = [null, null, null, null, null, null, null, null];
        this.pts = [];
        this.bbox = bbox;
    }

    insert(pt: V3, t: OT) {
        if (this.pts === null) {
            let nodes = this.nodes as OTNode[];
            let min_dist = nodes[0].bbox.core.sub(pt).len();
            let close_node = nodes[0];
            for (let i = 1; i < 8; i++) {
                let dist = nodes[i].bbox.core.sub(pt).len();
                if (dist < min_dist) {
                    min_dist = dist;
                    close_node = nodes[i];
                }
            }
            close_node.insert(pt, t);
        } else if (this.pts.length >= t.max_pts && this.bbox.width() > t.min_width) {
            let bboxes = this.bbox.explode();
            this.pts.push(pt);
            let nodes = this.nodes as OTNode[];
            for (let i = 0; i < 8; i++) {
                nodes[i] = new OTNode(bboxes[i]);
            }
            let p;
            while (p = this.pts.pop()) {
                let min_dist = (1 / 0);
                let min_idx = 0;
                for (let i = 0; i < 8; i++) {
                    let dist = bboxes[i].core.sub(p).len();
                    if (dist < min_dist) {
                        min_dist = dist;
                        min_idx = i;
                    }
                }
                (nodes[min_idx].pts as V3[]).push(p);
            }
            this.pts = null;
        } else {
            this.pts.push(pt);
        }
    }
}

export class OT {
    max_pts: number;
    min_width: number;
    root: OTNode;
    radius: number;

    constructor(bbox: BBox3, max_pts: number, min_width: number) {
        this.root = new OTNode(bbox);
        this.radius = bbox.radius();
        this.min_width = min_width;
        this.max_pts = max_pts;
    }

    insert(pt: V3) {
        this.root.insert(pt, this);
    }

    // Project lat, lng onto the sphere contained inside the root bbox, and
    // insert it
    insert_coord(lat: number, lng: number) {
        this.insert(latlng_to_ecef(this.radius, lat, lng));
    }
}

/**
 * Bounding box of image, essentially just a rectangle with sides equal
 * 2*IMG_RADIUS centered on the image GPS location.
 */
function img_bbox(img: Img): BBox {
    let nw = img.pos;
    nw[0] -= IMG_RADIUS;
    nw[1] -= IMG_RADIUS;
    let se = img.pos;
    se[0] += IMG_RADIUS;
    se[1] += IMG_RADIUS;
    return [nw, se];
}

/**
 * Create clusters from a set of `imgs`.
 */
function clusterize(imgs: Img[], d: number): ImgCluster[] {
    let clusters: ImgCluster[] = [];

    let sum = imgs[0].pos;
    let ct = imgs[0].pos;
    let mareas = [imgs[0].id];
    let is = 0;
    let push_cluster = (i: number) => {
        // Get bounding box of entire cluster, essentially just computes min x/y
        // for north-west and max x/y for south-east
        let [nw, se] = img_bbox(imgs[is]);
        for (let j = is + 1; j < i; j++) {
            let [jnw, jse] = img_bbox(imgs[j]);
            if (jnw[0] < nw[0]) nw[0] = jnw[0];
            if (jnw[1] < nw[1]) nw[1] = jnw[1];
            if (jse[0] > se[0]) se[0] = jse[0];
            if (jse[1] > se[1]) se[1] = jse[1];
        }

        clusters.push({
            center: ct,
            imgs: mareas,
            bbox: [nw, se]
        });
    };

    for (let i = 1; i < imgs.length; i++) {
        let img = imgs[i];
        let pos = img.pos;

        // Check if the circle has grown too big
        if (distance(ct, pos) > d) {
            push_cluster(i);
            mareas = [imgs[i].id];
            ct = imgs[i].pos;
            sum = imgs[i].pos;
            is = i;
        } else {
            mareas.push(imgs[i].id);
            sum[0] += pos[0];
            sum[1] += pos[1];
            // Re-center, `ct` is the rolling average of positions in `mareas`
            ct = [sum[0] / mareas.length, sum[1] / mareas.length];
        }
    }
    // End of images, so the cluster is pushed as-is
    push_cluster(mareas.length);

    return clusters;
}
