import { Asset as ImagePickerAsset } from "react-native-image-picker";
const Exif: any = require("react-native-exif");
import { distance } from "@turf/turf";
import moment from "moment";

import uuid from "../utils/uuid";

const POS_ZERO = [0,0];
const IMG_RADIUS = 0.001;

class Img {
	id: string = uuid();
	pos: number[] | undefined;
	uri: string;
	timestamp: number;

	constructor(img: ImagePickerAsset) {
		this.uri = img.uri as string;
		this.timestamp = moment(img.timestamp, "YYYY:MM:DD HH:mm:ss").toDate().getTime();
		// BUG?: I'm getting null values for this.timestamp when testing with pictures
	}

	getpos(): number[] {
		if (!this.pos) {
			throw new Error("Attempted to get position of uninitialized Img");
		}
		return this.pos.slice(0);
	}

	/**
	 * Load image data from disk, setting gps position to `pos_zero` if there is
	 * no exif gps data.
	 */
	async load(pos_zero?: number[]) {
		try {
			let res = await Exif.getLatLong(this.uri);
			this.pos = [res.longitude, res.latitude];
		} catch (err) {
			console.error(err);
			this.pos = pos_zero ? pos_zero : POS_ZERO;
		}
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
	async initialize(imgs: ImagePickerAsset[], d: number, pos_zero?: number[]) {
		let l: Img[] = [];
		for(let i of imgs) {
			let img = new Img(i);
			await img.load(pos_zero);
			l.push(img);
		}
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

class V3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(o: V3): V3 {
        return new V3(this.x + o.x, this.y + o.y, this.z + o.z);
    }

    sub(o: V3): V3 {
        return new V3(this.x - o.x, this.y - o.y, this.z - o.z);
    }

    scale(s: number): V3 {
        return new V3(this.x * s, this.y * s, this.z * s);
    }

    len(): number {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }
}

class BBox3 {
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
        let xhat = new V3((this.min.x + this.max.x) / 2, 0, 0);
        let yhat = new V3(0, (this.min.y + this.max.y) / 2, 0);
        let zhat = new V3(0, 0, (this.min.z + this.max.z) / 2);

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
        return this.max.sub(this.min).len() / 2;
    }

    includes(p: V3) {
        return (
            p.x >= this.min.x && p.x <= this.max.x &&
            p.y >= this.min.y && p.y <= this.max.y &&
            p.z >= this.min.z && p.z <= this.max.z
        )
    }
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
        if (!this.pts) {
            let nodes = this.nodes as OTNode[];
            for (let node of nodes) {
                node.insert(pt, t);
            }
        } else if (this.pts.length >= t.max_pts) {
            let bboxes = this.bbox.explode();
            this.pts.push(pt);
            for (let i = 0; i < 8; i++) {
                this.nodes[i] = new OTNode(bboxes[i]);
            }
            let nodes = this.nodes as OTNode[];
            {
                let pt;
                while (pt = this.pts.pop()) {
                    let min_dist = (1 / 0);
                    let min_idx = 0;
                    for (let i = 0; i < 8; i++) {
                        let dist = bboxes[i].core.sub(pt).len();
                        if (dist < min_dist) {
                            min_dist = dist;
                            min_idx = i;
                        }
                    }
                    (nodes[min_idx].pts as V3[]).push(pt);
                }
            }
            this.pts = null;
        } else {
            this.pts.push(pt);
        }
    }
}

class OT {
    max_pts: number = 1;
    min_width: number = 1;

    insert(pt: V3) {
    }
}

/**
 * Bounding box of image, essentially just a rectangle with sides equal
 * 2*IMG_RADIUS centered on the image GPS location.
 */
function img_bbox(img: Img): BBox {
	let nw = img.getpos();
	nw[0] -= IMG_RADIUS;
	nw[1] -= IMG_RADIUS;
	let se = img.getpos();
	se[0] += IMG_RADIUS;
	se[1] += IMG_RADIUS;
	return [nw, se];
}

/**
 * Create clusters from a set of `imgs`.
 */
function clusterize(imgs: Img[], d: number): ImgCluster[] {
	let clusters: ImgCluster[] = [];

	let sum = imgs[0].getpos();
	let ct = imgs[0].getpos();
	let mareas = [ imgs[0].id ];
	let is = 0;
	let push_cluster = (i: number) => {
		// Get bounding box of entire cluster, essentially just computes min x/y
		// for north-west and max x/y for south-east
		let [nw, se] = img_bbox(imgs[is]);
		for (let j = is+1; j < i; j++) {
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

	for(let i = 1; i < imgs.length; i++) {
		let img = imgs[i];
		let pos = img.getpos();

		// Check if the circle has grown too big
		if(distance(ct, pos) > d) {
			push_cluster(i);
			mareas = [ imgs[i].id ];
			ct = imgs[i].getpos()
			sum = imgs[i].getpos();
			is = i;
		}else{
			mareas.push( imgs[i].id );
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
