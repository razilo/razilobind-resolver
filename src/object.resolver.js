import Resolver from './resolver.js'
import StringResolver from './string.resolver.js'
import NumberResolver from './number.resolver.js'
import BooleanResolver from './boolean.resolver.js'
import PropertyResolver from './property.resolver.js'
import PhantomResolver from './phantom.resolver.js'
import MethodResolver from './method.resolver.js'
import ArrayResolver from './array.resolver.js'

/**
 * Object Resolver
 * Resolves data as object with literals or model properties
 *
 * Inherits
 *
 * property: data
 * method: detect(data) { return bool }
 */
export default class ObjectResolver extends Resolver {
	constructor(node) {
		super();
		this.node = node;
		this.name = 'object';
		this.regex = ObjectResolver.regex();
	}

	/**
	 * resolve()
	 * Resolve data to a string, set any observables on data
	 */
	resolve(object, delay) {
		var res = ObjectResolver.toObject(this.data, object, this.node, delay);
		this.resolved = res.resolved;
		this.observers = res.observers;
	}

	/**
	 * static regex()
	 * turns a path and object to a property value, returning list of observers on any found properties
	 * @return object regex The regex used to validate if of type or not
	 */
	static regex() {
		return /^\{{1}\s?((\'{1}[^\']+\'{1}|[a-zA-Z_]+|[a-zA-Z_]{1}[^,]+[a-zA-Z_\]]{1}|)\s?:{1}\s?([0-9]+|\'{1}[^\']+\'{1}|[a-zA-Z_]+|[a-zA-Z_\$]{1}[^,]+[a-zA-Z0-9_\]]{1}|\[{1}.*\]{1}|\{{1}.*\}{1}|[a-zA-Z]{1}[a-zA-Z0-9_]+((\.[a-zA-Z]{1}[a-zA-Z0-9_]+)|(\[([0-9]+|[a-zA-Z_]{1}[a-zA-Z0-9_.\[\'\]]+)\])|(\[\'[^\[\]\']+\'\]))*\({1}[^\(\)]*\){1})\s?,?\s?)*\s?\}{1}$/;
	}

	/**
	 * static toObject()
	 * turns a data and object to a property value, returning list of observers on any found properties
	 * @param string data The data to resolve on the object
	 * @param object object The object to resolve the data on
	 * @return object {resolved: ..., observers:...} The resolved data and any observers needed to track future changes
	 */
	static toObject(data, object, node, delay) {
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
		for (var ii = 0; ii < values.length; ii++)
		{
			values[ii] = values[ii].trim();

			// split by ':' preserving data in second part
			var vKey = values[ii].substring(0, values[ii].indexOf(':')).trim();
			var vVal = values[ii].substring(values[ii].indexOf(':') +1, values[ii].length).trim();

			// resolve key
			if (StringResolver.regex().test(vKey)) vKey = StringResolver.toString(vKey).resolved;
			else if (PropertyResolver.regex().test(vKey))
			{
				var propKeyRes = PropertyResolver.toProperty(vKey, object, node);
				if (typeof propKeyRes === 'undefined') throw 'Could not resolve data: "' + vKey + '" to property';
				vKey = propKeyRes;
				observers = Resolver.mergeObservers(observers, propKeyRes.observers);
			}
			else if (PhantomResolver.regex().test(vKey))
			{
				var phKeyRes = PhantomResolver.toProperty(vKey, object, node);
				if (typeof phKeyRes === 'undefined') throw 'Could not resolve data: "' + vKey + '" to phantom';
				vKey = phKeyRes.resolved;
				observers = Resolver.mergeObservers(observers, phKeyRes.observers);
			}
			else vKey = 'undefined';

			// resolve value
			if (BooleanResolver.regex().test(vVal)) vVal = BooleanResolver.toBoolean(vVal).resolved;
			else if (StringResolver.regex().test(vVal)) vVal = StringResolver.toString(vVal).resolved;
			else if (NumberResolver.regex().test(vVal)) vVal = NumberResolver.toNumber(vVal).resolved;
			else if (PropertyResolver.regex().test(vVal))
			{
				var propValRes = PropertyResolver.toProperty(vVal, object, node);
				if (typeof propValRes === 'undefined') throw 'Could not resolve data: "' + vVal + '" to property';
				vVal = propValRes.resolved;
				observers = Resolver.mergeObservers(observers, propValRes.observers);
			}
			else if (PhantomResolver.regex().test(vVal))
			{
				var phValRes = PhantomResolver.toProperty(vVal, object, node);
				if (typeof phValRes === 'undefined') throw 'Could not resolve data: "' + vVal + '" to phantom';
				vVal = phValRes.resolved;
				observers = Resolver.mergeObservers(observers, phValRes.observers);
			}
			else if (MethodResolver.regex().test(vVal))
			{
				var methValRes = MethodResolver.toMethod(vVal, object, node, delay);
				if (typeof methValRes === 'undefined') throw 'Could not resolve data: "' + vVal + '" to method';
				vVal = methValRes.resolved;
				observers = Resolver.mergeObservers(observers, methValRes.observers);
			}
			else if (ArrayResolver.regex().test(vVal))
			{
				var arrValRes = ArrayResolver.toArray(vVal, object, node);
				if (typeof arrValRes === 'undefined') throw 'Could not resolve data: "' + vVal + '" to array';
				vVal = arrValRes.resolved;
				observers = Resolver.mergeObservers(observers, arrValRes.observers);
			}
			else if (ObjectResolver.regex().test(vVal))
			{
				var objValRes = ObjectResolver.toObject(vVal, object, node);
				if (typeof objValRes === 'undefined') throw 'Could not resolve data: "' + vVal + '" to object';
				vVal = objValRes.resolved;
				observers = Resolver.mergeObservers(observers, objValRes.observers);
			}
			else vVal = undefined;

			result[vKey] = vVal;
		}

		return {resolved: result, observers: observers};
	}
}
