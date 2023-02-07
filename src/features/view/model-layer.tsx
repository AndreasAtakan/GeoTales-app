//

import MapboxGL from "@rnmapbox/maps";

export default class ModelLayer extends MapboxGL.RasterLayer {
	//id = "object";
	//style = {};

	constructor() {
		super({
			id: "object",
			style: {}
		})
	}

	render() {
		return <MapboxGL.RasterLayer id="object" style={{}} />
	}
};
