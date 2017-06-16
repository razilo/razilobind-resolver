import Resolver from './resolver.js'
import StringResolver from './string.resolver.js'
import NumberResolver from './number.resolver.js'
import BooleanResolver from './boolean.resolver.js'
import PropertyResolver from './property.resolver.js'
import PhantomResolver from './phantom.resolver.js'
import ArrayResolver from './array.resolver.js'
import ObjectResolver from './object.resolver.js'

/**
 * Method Resolver
 * Resolves data to model method
 *
 * Inherits
 *
 * property: data
 * method: detect(data) { return bool }
 */
export default class MethodResolver extends Resolver {
	constructor(node) {
		super();
		this.node = node;
		this.name = 'method';
		this.regex = MethodResolver.regex();
	}

	/**
	 * resolve()
	 * Resolve data to a property, set any observables on data
	 * @param object object The object that you want to resolve data to
	 */
	resolve(object, delay) {
		var res = MethodResolver.toMethod(this.data, object, this.node, delay);
		this.resolved = res.resolved;
		this.observers = res.observers;
	}

	/**
	 * static regex()
	 * Used to validate if data is a method call or not
	 * @return object regex The regex used to validate if of type or not
	 */
	static regex() {
		return /^[a-zA-Z]{1}[a-zA-Z0-9_]+((\.[a-zA-Z]{1}[a-zA-Z0-9_]+)|(\[([0-9]+|[a-zA-Z_]{1}[a-zA-Z0-9_.\[\'\]]+)\])|(\[\'[^\[\]\']+\'\]))*\({1}[^\(\)]*\){1}$/;
	}

	/**
	 * static toMethod()
	 * turns a path and object to a property value, returning list of observers on any found properties
	 * @param string data The data to resolve on the object
	 * @param object object The object to resolve the path on
	 * @return object {resolved: ..., observers:...} The resolved data and any observers needed to track future changes
	 */
	static toMethod(data, object, node, delay) {
		// get the bit before (
		data = data.trim();
		var key = data.substring(0, data.indexOf('('));

		// get the bit between ()
		var val = data.substring(data.indexOf('(') +1, data.length -1);


		// resolve method name
		if (!PropertyResolver.regex().test(key)) return undefined;
		var resolver = PropertyResolver.toProperty(key, object, node);
		var method = resolver.resolved;
		var observers = resolver.observers;
		if (typeof method !== 'function') return undefined;

		// split data by , but do not split objects or arrays
		var parts = val.split(',');
		var values = [parts[0]];
		for (var i = 1; i < parts.length; i++)
		{
			var sb = (values[values.length - 1].match(/\[/g) || []).length == (values[values.length - 1].match(/\]/g) || []).length;
			var mb = (values[values.length - 1].match(/\{/g) || []).length == (values[values.length - 1].match(/\}/g) || []).length;

			if (sb && mb) values[values.length] = parts[i];
			else values[values.length - 1] += ',' + parts[i];
		}

		// resolve each split data
		for (var ii = 0; ii < values.length; ii++)
		{
			values[ii] = values[ii].trim();

			// resolve value
			if (BooleanResolver.regex().test(values[ii])) values[ii] = BooleanResolver.toBoolean(values[ii]).resolved;
			else if (StringResolver.regex().test(values[ii])) values[ii] = StringResolver.toString(values[ii]).resolved;
			else if (NumberResolver.regex().test(values[ii])) values[ii] = NumberResolver.toNumber(values[ii]).resolved;
			else if (PropertyResolver.regex().test(values[ii]))
			{
				var propValRes = PropertyResolver.toProperty(values[ii], object, node);
				values[ii] = propValRes.resolved;
				observers = Resolver.mergeObservers(observers, propValRes.observers);
			}
			else if (PhantomResolver.regex().test(values[ii]))
			{
				var phValRes = PhantomResolver.toProperty(values[ii], object, node);
				values[ii] = phValRes.resolved;
				observers = Resolver.mergeObservers(observers, phValRes.observers);
			}
			else if (ArrayResolver.regex().test(values[ii]))
			{
				var arrValRes = ArrayResolver.toArray(values[ii], object, node);
				values[ii] = arrValRes.resolved;
				observers = Resolver.mergeObservers(observers, arrValRes.observers);
			}
			else if (ObjectResolver.regex().test(values[ii]))
			{
				var objValRes = ObjectResolver.toObject(values[ii], object, node);
				values[ii] = objValRes.resolved;
				observers = Resolver.mergeObservers(observers, objValRes.observers);
			}
			else values[ii] = undefined;
		}

		// for event binders... return method instead of running it
		return {resolved: !!delay ? {method: method, values: values} : method.apply(object, values), observers: observers};
	}
}
