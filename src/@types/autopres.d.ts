/** A bounding box is [North-Western corner, South-Eastern corner] */
type BBox = [ number[], number[] ];

interface ImgCluster {
    center: number[],
    bbox: BBox,
    imgs: string[]
};

type ImageAsset = PhotoIdentifier.node;
