import moment from "moment";

export default function getdate(t: number) {
	return moment.unix(t).format("D MMM");
}
