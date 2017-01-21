import Resolver from './resolver.js'
import PhantomResolver from './phantom.resolver.js'

/**
 * Property Resolver
 * Resolves data to object, sets observers on any paths found
 *
 * Inherits
 *
 * property: data
 * method: detect(data) { return bool }
 */
export default class PropertyResolver extends Resolver {
	constructor(node) {
		super();
		this.node = node;
		this.name = 'property';
		this.regex = PropertyResolver.regex();
	}

	/**
	 * resolve()
	 * Resolve data to a property, set any observables on data
	 * @param object object The object that you want to resolve data to
	 */
	resolve(object) {
		var res = PropertyResolver.toProperty(this.data, object, this.node);
		this.resolved = res.resolved;
		this.observers = res.observers;
	}

	/**
	 * static regex()
	 * turns a path and object to a property value, returning list of observers on any found properties
	 * @return object regex The regex used to validate if of type or not
	 */
	static regex() {
		return /^[a-zA-Z]{1}[a-zA-Z0-9_]+((\.[a-zA-Z]{1}[a-zA-Z0-9_]+)|(\[([0-9]+|[a-zA-Z_]{1}[a-zA-Z0-9_.\[\'\]]+)\])|(\[\'[^\[\]\']+\'\]))*$/;
	}

	/**
	 * static toProperty()
	 * turns a path and object to a property value, returning list of observers on any found properties
	 * @param string path The path to resolve on the object
	 * @param object object The object to resolve the path on
	 * @return object {resolved: ..., observers:...} The resolved data and any observers needed to track future changes
	 */
	static toProperty(data, object, node) {
		// split by dot or open square bracket but be carefull not to break nested data
		data = data.trim();
		var parts = data.replace(/\[/g, '.[').split(/\./);
		var values = [parts[0]];
		for (var i = 1; i < parts.length; i++)
		{
			var sb = (values[values.length - 1].match(/\[/g) || []).length == (values[values.length - 1].match(/\]/g) || []).length;

			if (sb) values[values.length] = parts[i];
			else
			{
				values[values.length - 1] += '.' + parts[i];
				values[values.length - 1] = values[values.length - 1].replace(/\.\[/g, '[');
			}
		}

		// work through seperated data resolving or pushing for further analysis
		var observable = '';
		var observers = [];
		var result = object;
		for (var ii = 0; ii < values.length; ii++)
		{
			values[ii] = values[ii].trim();

			if (values[ii].indexOf("[") == 0)
			{
				if (/^\[\s*[0-9]+\s*\]$/.test(values[ii]))
				{
					// index
					let key = parseInt(values[ii].replace(/\[|\]/g, '').trim());
					result = result[key];
					observable += '.' + key;
				}
				else if (/^\[\s*\'(.*)\'\s*\]$/.test(values[ii]))
				{
					// key
					let key = values[ii].replace(/\'|\[|\]/g, '').trim();
					result = result[key];
					observable += '.' + key;
				}
				else if (PhantomResolver.regex().test(values[ii].substring(1, values[ii].length -1)))
				{
					var phRes = PhantomResolver.toProperty(values[ii].substring(1, values[ii].length -1), object, node);
					result = phRes.resolved ? result[phRes.resolved] : undefined;
					observable += '.' + phRes.resolved;
					observers = Resolver.mergeObservers(observers, phRes.observers);
				}
				else
				{
					var propRes = PropertyResolver.toProperty(values[ii].substring(1, values[ii].length -1), object, node);
					result = propRes.resolved ? result[propRes.resolved] : undefined;
					observable += '.' + propRes.resolved;
					observers = Resolver.mergeObservers(observers, propRes.observers);
				}
			}
			else
			{
				result = result ? result[values[ii]] : undefined; // removing array items
				if (typeof result !== 'undefined') observable += '.' + values[ii];
			}
		}

		// compact observable path to any other observables found
		if (observable)	observers.push(observable.charAt(0) === '.' ? observable.substring(1, observable.length) : observable);

		return {resolved: result, observers: observers};
	}
}
