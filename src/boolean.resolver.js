import Resolver from './resolver.js'

/**
 * Boolean Resolver
 * Resolves data as boolean true or false
 *
 * Inherits
 *
 * property: data
 * method: detect(data) { return bool }
 */
export default class BooleanResolver extends Resolver {
	constructor(node) {
		super();
		this.node = node;
		this.name = 'boolean';
		this.regex = BooleanResolver.regex();
	}

	/**
	 * resolve()
	 * Resolve data to a boolean true or false, set any observables on data
	 */
	resolve(object) {
		var res = BooleanResolver.toBoolean(this.data);
		this.resolved = res.resolved;
		this.observers = res.observers;
	}

	/**
	 * static regex()
	 * turns a path and object to a property value, returning list of observers on any found properties
	 * @return object regex The regex used to validate if of type or not
	 */
	static regex() {
		return /^true|false$/;
	}

	/**
	 * static toBoolean()
	 * turns a path and object to a property value, returning list of observers on any found properties
	 * @param string data The data to resolve to a string
	 * @return object {resolved: ..., observers:...} The resolved data and any observers needed to track future changes
	 */
	static toBoolean(data) {
		return {resolved: data == 'true' ? true : false, observers: []};
	}
}
