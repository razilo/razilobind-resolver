import Resolver from './resolver.js'
import StringResolver from './string.resolver.js'
import NumberResolver from './number.resolver.js'
import BooleanResolver from './boolean.resolver.js'
import PropertyResolver from './property.resolver.js'
import PhantomResolver from './phantom.resolver.js'
import MethodResolver from './method.resolver.js'
import ObjectResolver from './object.resolver.js'

/**
 * Array Resolver
 * Resolves data as array with literals or model properties
 *
 * Inherits
 *
 * property: data
 * method: detect(data) { return bool }
 */
export default class ArrayResolver extends Resolver {
	constructor(node) {
		super();
		this.node = node;
		this.name = 'array';
		this.regex = ArrayResolver.regex();
	}

	/**
	 * resolve()
	 * Resolve data to a string, set any observables on data
	 */
	resolve(object) {
		var res = ArrayResolver.toArray(this.data, object, this.node);
		this.resolved = res.resolved;
		this.observers = res.observers;
	}

	/**
	 * static regex()
	 * turns a path and object to a property value, returning list of observers on any found properties
	 * @return object regex The regex used to validate if of type or not
	 */
	static regex() {
		return /^\[{1}\s?(([0-9]+|\'{1}[^\']+\'{1}|[a-zA-Z_]+|[\$a-zA-Z_]{1}[^,]+[a-zA-Z_\]]{1}|\[{1}.*\]{1}|\{{1}.*\}{1}|[a-zA-Z]{1}[a-zA-Z0-9_]+((\.[a-zA-Z]{1}[a-zA-Z0-9_]+)|(\[([0-9]+|[a-zA-Z_]{1}[a-zA-Z0-9_.\[\'\]]+)\])|(\[\'[^\[\]\']+\'\]))*\({1}[^\(\)]*\){1})\s?,?\s?)*\s?\]{1}$/;
	}

	/**
	 * static toArray()
	 * turns a data and object to a property value, returning list of observers on any found properties
	 * @param string data The data to resolve on the object
	 * @param object object The object to resolve the data on
	 * @return object {resolved: ..., observers:...} The resolved data and any observers needed to track future changes
	 */
	static toArray(data, object, node) {
		// split by comma but be carefull not to break nested data
		data = data.trim();
		var parts = data.substring(1, data.length -1).split(',');
		var values = [parts[0]];
		for (var i = 1; i < parts.length; i++)
		{
			var sb = (values[values.length - 1].match(/\[/g) || []).length == (values[values.length - 1].match(/\]/g) || []).length;
			var mb = (values[values.length - 1].match(/\{/g) || []).length == (values[values.length - 1].match(/\}/g) || []).length;

			if (sb && mb) values[values.length] = parts[i];
			else values[values.length - 1] += ',' + parts[i];
		}

		// work through seperated data resolving or pushing for further analysis
		var observers = [];
		var result = [];
		for (var ii = 0; ii < values.length; ii++) {
			values[ii] = values[ii].trim();
			if (BooleanResolver.regex().test(values[ii])) result.push(BooleanResolver.toBoolean(values[ii]).resolved);
			else if (StringResolver.regex().test(values[ii])) result.push(StringResolver.toString(values[ii]).resolved);
			else if (NumberResolver.regex().test(values[ii])) result.push(NumberResolver.toNumber(values[ii]).resolved);
			else if (PropertyResolver.regex().test(values[ii]))
			{
				var propRes = PropertyResolver.toProperty(values[ii], object, node);
				if (typeof propRes === 'undefined') throw 'Could not resolve data: "' + values[ii] + '" to property';
				result.push(propRes.resolved);
				observers = Resolver.mergeObservers(observers, propRes.observers);
			}
			else if (PhantomResolver.regex().test(values[ii]))
			{
				var phRes = PhantomResolver.toProperty(values[ii], object, node);
				if (typeof phRes === 'undefined') throw 'Could not resolve data: "' + values[ii] + '" to phantom';
				result.push(phRes.resolved);
				observers = Resolver.mergeObservers(observers, phRes.observers);
			}
			else if (MethodResolver.regex().test(values[ii]))
			{
				var methRes = MethodResolver.toMethod(values[ii], object, node);
				if (typeof methRes === 'undefined') throw 'Could not resolve data: "' + values[ii] + '" to method';
				result.push(methRes.resolved);
				observers = Resolver.mergeObservers(observers, methRes.observers);
			}
			else if (ArrayResolver.regex().test(values[ii]))
			{
				var arrRes = ArrayResolver.toArray(values[ii], object, node);
				if (typeof arrRes === 'undefined') throw 'Could not resolve data: "' + values[ii] + '" to array';
				result.push(arrRes.resolved);
				observers = Resolver.mergeObservers(observers, arrRes.observers);
			}
			else if (ObjectResolver.regex().test(values[ii]))
			{
				var objRes = ObjectResolver.toObject(values[ii], object, node);
				if (typeof objRes === 'undefined') throw 'Could not resolve data: "' + values[ii] + '" to object';
				result.push(objRes.resolved);
				observers = Resolver.mergeObservers(observers, objRes.observers);
			}
		}

		return {resolved: result, observers: observers};
	}
}
