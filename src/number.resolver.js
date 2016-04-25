import Resolver from './resolver.js'

/**
 * Number Resolver
 * Resolves data as number
 *
 * Inherits
 *
 * property: data
 * method: detect(data) { return bool }
 */
export default class NumberResolver extends Resolver {
	constructor(node) {
		super();
		this.node = node;
		this.name = 'number';
		this.regex = NumberResolver.regex();
	}

	/**
	 * resolve()
	 * Resolve data to a number, set any observables on data
	 */
	resolve(object) {
		var res = NumberResolver.toNumber(this.data);
		this.resolved = res.resolved;
		this.observers = res.obeservers;
	}

	/**
	 * static regex()
	 * turns a path and object to a property value, returning list of observers on any found properties
	 * @return object regex The regex used to validate if of type or not
	 */
	static regex() {
		return /^[0-9]+(\.[0-9]+)?$/;
	}

	/**
	 * static toNumber()
	 * turns a path and object to a property value, returning list of observers on any found properties
	 * @param string data The data to resolve to a string
	 * @return object {resolved: ..., observers:...} The resolved data and any observers needed to track future changes
	 */
	static toNumber(data) {
		return {resolved: data, observers: []};
	}
}
