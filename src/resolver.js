/**
 * Resolver
 * Generic resolver methods used accross all resolvers
 */
export default class Resolver {
	constructor() {
		this.node = undefined;
		this.name = undefined;
		this.regex = undefined;
	}

	/**
	 * detect()
	 * is data resolvable to resolver
	 * @param string data The data string to try and resolve to type
	 * @return bool True on resolvable, false on fail.
	 */
	detect(data) {
		this.data = data;
		return this.regex.test(this.data);
	}

	// join two observer arrays togethor without duplicating
	static mergeObservers(obsA, obsB) {
		for (var i = 0; i < obsB.length; i++) {
			if (obsA.indexOf(obsB[i]) < 0) obsA.push(obsB[i]);
		}

		return obsA;
	}
}
