import Resolver from './resolver.js'

/**
 * String Resolver
 * Resolves data as string literal
 *
 * Inherits
 *
 * property: data
 * method: detect(data) { return bool }
 */
export default class StringResolver extends Resolver {
	constructor(node) {
		super();
		this.node = node;
		this.name = 'string';
		this.regex = StringResolver.regex();
	}

	/**
	 * resolve()
	 * Resolve data to a string, set any observables on data
	 */
	resolve(object) {
		var res = StringResolver.toString(this.data);
		this.resolved = res.resolved;
		this.observers = res.obeservers;
	}

	/**
	 * static regex()
	 * turns a path and object to a property value, returning list of observers on any found properties
	 * @return object regex The regex used to validate if of type or not
	 */
	static regex() {
		return /^\'.*\'$/;
	}

	/**
	 * static toString()
	 * turns a path and object to a property value, returning list of observers on any found properties
	 * @param string data The data to resolve to a string
	 * @return object {resolved: ..., observers:...} The resolved data and any observers needed to track future changes
	 */
	static toString(data) {
		return {resolved: data.substring(1, data.length -1), observers: []};
	}
}
