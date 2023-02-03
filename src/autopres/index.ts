import { Asset as ImagePickerAsset } from "react-native-image-picker";
//import Exif from "react-native-exif";
const Exif: any = require("react-native-exif");
import Victor from "victor";
import { distance } from "@turf/turf";
import moment from "moment";

const POS_ZERO = [0, 0];
const IMG_RADIUS = 0.001;

class Slide {}

/** Presentation */
export class Pres {
	clusters: ImgCluster[] = [];
	slide: number = 0;

	/**
	 * Parameters:
	 *   - `imgs`: Images to construct presentation from
	 *   - `d`: Maximum radius of image cluster in kilometers
	 */
	async initialize(imgs: ImagePickerAsset[], d: number) {
		imgs.sort((u, v) => exif_time(u) - exif_time(v));
		this.clusters = await clusterize(imgs, d);
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
async function img_bbox(img: ImagePickerAsset): Promise<BBox> {
	let nw = await exif_pos(img);
	nw[0] -= IMG_RADIUS;
	nw[1] -= IMG_RADIUS;
	let se = await exif_pos(img);
	se[0] += IMG_RADIUS;
	se[1] += IMG_RADIUS;
	return [nw, se];
}

/**
 * Create clusters from a set of `imgs`.
 */
async function clusterize(imgs: ImagePickerAsset[], d: number): Promise<ImgCluster[]> {
	let clusters: ImgCluster[] = [];

	let sum = await exif_pos(imgs[0]);
	let ct = await exif_pos(imgs[0]);
	let mareas = [imgs[0]];
	let is = 0;
	let push_cluster = async (i: number) => {
		// Get bounding box of entire cluster, essentially just computes min x/y
		// for north-west and max x/y for south-east
		let [nw, se] = await img_bbox(imgs[is]);
		for (let j = is+1; j < i; j++) {
			let [jnw, jse] = await img_bbox(imgs[j]);
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
		let pos = await exif_pos(img);

		// Check if the circle has grown too big
		let dist = distance(ct, pos);
		console.log(`Distance between ${ct} -> ${pos} = ${dist}`);
		if (distance(ct, pos) > d) {
			await push_cluster(i);
			mareas = [imgs[i]];
			ct = await exif_pos(imgs[i]);
			sum = await exif_pos(imgs[i]);
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
	await push_cluster(mareas.length);

	return clusters;
}

function exif_time(img: ImagePickerAsset): number {
	return moment(img.timestamp, "YYYY:MM:DD HH:mm:ss").toDate().getTime();
}

async function exif_pos(img: any, fb?: number[]): Promise<number[]> {
	fb = fb ? fb : POS_ZERO;

	let res;
	try { res = await Exif.getLatLong(img.uri); }
	catch(err) { console.log(err); return fb;  }

	console.log( JSON.stringify(res) );

	return [res.longitude, res.latitude];
}
