import { distance } from "@turf/turf";

import uuid from "../utils/uuid";

const POS_ZERO = [8, 50];
const IMG_RADIUS = 0.001;

class Img {
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
		this.pos = l ? [ l.longitude, l.latitude ] : pos_zero || POS_ZERO;
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
		let pos = img.pos;

		// Check if the circle has grown too big
		if(distance(ct, pos) > d) {
			push_cluster(i);
			mareas = [ imgs[i].id ];
			ct = imgs[i].pos;
			sum = imgs[i].pos;
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
