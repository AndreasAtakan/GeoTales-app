import { Asset as ImagePickerAsset } from "react-native-image-picker";
const Exif: any = require("react-native-exif");
import { distance } from "@turf/turf";
import moment from "moment";

const POS_ZERO = [0, 0];
const IMG_RADIUS = 0.001;

class Img {
	pos: number[] | undefined;
	uri: string;
	timestamp: number;

	constructor(img: ImagePickerAsset) {
		this.uri = img.uri as string;
		this.timestamp = moment(img.timestamp, "YYYY:MM:DD HH:mm:ss").toDate().getTime();
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
	slide: number = 0;

	/**
	 * Parameters:
	 *   - `imgs`: Images to construct presentation from
	 *   - `d`: Maximum radius of image cluster in kilometers
	 */
	async initialize(img_picks: ImagePickerAsset[], d: number) {
		let imgs = img_picks.map(i => new Img(i));
		let awaits = imgs.map(i => i.load());
		Promise.all(awaits); // await in parallel
		imgs.sort((u, v) => u.timestamp - v.timestamp);
		this.clusters = clusterize(imgs, d);
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
	let mareas = [imgs[0]];
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

	for (let i = 1; i < imgs.length; i++) {
		let img = imgs[i];
		let pos = img.getpos();

		// Check if the circle has grown too big
		let dist = distance(ct, pos);
		console.log(`Distance between ${ct} -> ${pos} = ${dist}`);
		if (distance(ct, pos) > d) {
			push_cluster(i);
			mareas = [imgs[i]];
			ct = imgs[i].getpos()
			sum = imgs[i].getpos();
			is = i;
		} else {
			mareas.push(imgs[i]);
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
