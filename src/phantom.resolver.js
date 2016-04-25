import Resolver from './resolver.js'
import PropertyResolver from './property.resolver.js'

/**
 * Phantom Property Resolver
 * Resolves phantom property to real property based on parent iteration.
 * Phantom properties proceed with a $ and must resolve to an itterable instance
 *
 * Inherits
 *
 * property: data
 * method: detect(data) { return bool }
 */
export default class PhantomResolver extends Resolver {
	constructor(node) {
		super();
		this.node = node;
		this.name = 'phantom';
		this.regex = PhantomResolver.regex();
	}

	/**
	 * resolve()
	 * Resolve data to a property, set any observables on data
	 * @param object object The object that you want to resolve data to
	 */
	resolve(object) {
		var res = PhantomResolver.toProperty(this.data, object, this.node);
		this.resolved = res.resolved;
		this.observers = res.observers;
	}

	/**
	 * static regex()
	 * regex used to test resolvable data on
	 * @return object regex The regex used to validate if of type or not
	 */
	static regex() {
		return /^\${1}[a-zA-Z]{1}[a-zA-Z0-9_]+((\.[a-zA-Z]{1}[a-zA-Z0-9_]+)|(\[([0-9]+|[a-zA-Z_]{1}[a-zA-Z0-9_.\[\'\]]+)\])|(\[\'[^\[\]\']+\'\]))*$/;
	}

	/**
	 * static toProperty()
	 * turns a path and object to a property value, returning list of observers on any found properties
	 * @param string path The path to resolve on the object
	 * @param object object The object to resolve the path on
	 * @param HTMLElement node The node that the property is being generated for (allows look back for phantom)
	 * @return object {resolved: ..., observers:...} The resolved data and any observers needed to track future changes
	 */
	static toProperty(data, object, node) {
		data = data.trim();
		var result = {resolved: undefined, observers: []};
		if (!node || !node.parentNode) return result;

		// find closest phantom up nodes
		var sniffed = node;
		while (sniffed && !sniffed.razilovm && !sniffed.phantom)
		{
			if (sniffed.phantom && (!sniffed.phantom.keyName || sniffed.phantom.keyName == data)) break;
			if (sniffed.phantom && (!sniffed.phantom.valueName || sniffed.phantom.valueName == data)) break;
			sniffed = sniffed.parentNode;
		}
		if (!sniffed || !sniffed.phantom) return result;

		// resolve key and value names, else default (force $ in front)
		var keyName = sniffed.phantom.keyName ? sniffed.phantom.keyName : '$key';
		var valueName = sniffed.phantom.valueName ? sniffed.phantom.valueName : '$value';
		if (keyName.indexOf('$') !== 0) keyName = '$' + keyName;
		if (valueName.indexOf('$') !== 0) valueName = '$' + valueName;

		// lets resolve phantom data, check first part of data for phantom name
		var pName = data.split(/\.|\[/)[0];
		var pProperty = data.length > pName.length ? data.substring(pName.length + 1, data.length) : undefined;
		if (pName == keyName) result.resolved = sniffed.phantom.iterationKey;
		else if (pName == valueName)
		{
			// if observers, resolve result.resolved to live value, else use one time value
			if (sniffed.phantom.observers.length > 0)
			{
				// clone observers, ensure root is changed to reflect itterable (last one in stack)
				for (var key in sniffed.phantom.observers) result.observers.push(sniffed.phantom.observers[key]);
				result.observers[result.observers.length -1] = result.observers[result.observers.length -1] + '.' + sniffed.phantom.iterationKey;

				// get live value from model
				var obsParts = result.observers[result.observers.length -1].split('.');
				result.resolved = object[obsParts[0]];
				for (var i = 1; i < obsParts.length; i++) result.resolved = result.resolved[obsParts[i]];

				// resolve properties on phantom and collect observers
				if (pProperty)
				{
					var propRes = PropertyResolver.toProperty(pProperty, result.resolved);
					result.resolved = typeof propRes.resolved !== 'undefined' ? propRes.resolved : undefined;
					if (propRes.observers.length > 0)
					{
						propRes.observers[propRes.observers.length -1] = result.observers[result.observers.length -1] + '.' + propRes.observers[propRes.observers.length -1];
						for (var key2 in propRes.observers) result.observers.push(propRes.observers[key2]);
					}
				}
			}
			else result.resolved = sniffed.phantom.initialValue; // fugees (one-time!)
		}

		return result;
	}
}
