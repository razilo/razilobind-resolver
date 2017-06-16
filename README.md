# raziloBind - Resolvers ES6 JS/HTML Binding Library

## What is raziloBind?


ES6 JS/HTML binding library for creating dynamic web applications through HTML attribute binding. Made up of 4 libraries, puled in via a parent package that pulls in all required parts and configures as importable ES6 module 'RaziloBind'.

* **[razilobind-core](https://github.com/smiffy6969/razilobind-core)** *(the main part)*, to traverse, detect and observe.
* **[razilobind-binder](https://github.com/smiffy6969/razilobind-binder) [injectables]** *(the actual binders)*, binding object properties to elements to do various things.
* **[razilobind-resolver](https://github.com/smiffy6969/razilobind-resolver) [injectables]** *(to parse attribute data)*, resolving attribute data to things like strings, numbers, objects, methods etc.
* **[razilobind-alterer](https://github.com/smiffy6969/razilobind-alterer) [injectables]** *(to change things)*, altering resolved data to something else without affecting the model.

This package **razilobind-core**, is the base functionality that binds, observes, traverses and detects, allowing injectables to be used on dom elements.


## What are Resolvers?

Resolvers are a way we resolve the data inside razilobind attributes to something legible, such as a string, an object a method (function assigned to a model property). They provide one simple generic task, resolving a text based string to a concrete type. Why do we use resolvers? because eval is evil, this way we standardize how data is used in attributes accross the board, and only ever pass data in in a fashion that is resolvable. If data is not resolvable, no further action is taken. If data is resolvable, it has a resolved value, as well as any observers that if fired, will force re-evaluation of the entire element. Simply put, a property used anywhere in resolvable attribute data, once changed will force re-evaluation. This type of binding offers two way, one way something in the middle.

Some binding frameworks do not offer two way binding on anything other than properties, we say why shouldn't a function be re run if a property sent in, was changed?

Resolvers work by using simple quick regex matching initially to decide if further work should be carried out. If passing this simple quick quick, the data is then analysed further to attempt to extract the data and convert it into proper types. Resolvers are simple, quick and reusable. Some resolvers use other resolvers to check portions of its resolvable data, for instance th ebject and array resolvers use all other resolvers to check values. Resolvers have no attribute naming convention as they are the data inside the attribute quotes, but they do have specific structures that define them as the resolvable data...


```html
<!-- literal resolvers such as string, number, boolean -->
<p bind-text="'Hellow World'"></p>
<p bind-text="12345"></p>
<p bind-show="true"></p>

<!-- array resolver with various resolvable types inside -->
<p bind-class="['a-string', 1234, foobar]"></p>
<!-- array resolver with nested arrays/objects -->
<p bind-for="[{'id': 1, data: [10, 11, 12]}, {'id': 3, data: [100, 110, 120]}, {'id': 3, data: [1000, 1100, 1200]}]"></p>

<!-- object resolver with various resolvable types inside -->
<p bind-class="{'name': 'a-string', 'value': 1234, 'something': foobar}"></p>
<!-- object resolver with nested arrays/objects -->
<p bind-for="{'names': ['dave', 'john'], 'places': {'somewhere': 10, 'somewhere else': 20}}"></p>

<!-- property resolver - 'foobar' property of the model -->
<p bind-text="foobar"></p>
<!-- property resolver - 'foobar.baz.boo' we can have dot or bracket notation -->
<p bind-text="foobar.baz['boo']"></p>
<!-- property resolver - 'foobar.baz.boo.namePropertyValue' we can also use property values as the key! This adds a another observer for 'foobar.name' -->
<p bind-text="foobar.baz['boo'][foobar.name]"></p>

<!-- method resolver - 'someMethod' method assign to model property -->
<p bind-text="someMethod()"></p>
<!-- method resolver - sending in variables, these can be any resolvable types (this will be re-run if foobar.baz changes!) -->
<p bind-text="someMethod('hello', foobar.baz)"></p>
<!-- method resolver - use them anyhow you like, change foo.disabled, re-run the method and alter the class! -->
<p bind-class="{'disabled': someMethod(foo.disabled)}"></p>

<!-- phantom binder - they resolve back to an object/array key and value, they start with a $, they can be renamed with some binders like 'for'! -->
<ul>
	<li bind-for="object"><span bind-text="$key"></span> <span bind-text="$value"></span></li>
</ul>
```


NOTE: Things to remember, properties are two way, anything using a property is two way, everything else is one way, one time bind on load. Resolver syntax can be thought of as JSON but without the double quotes. You can combine resolver types. Finally, resolvable data is used in ALL raziloBind attributes, we will never pipe, bracket, embed logic, lets keep things clean.


## What Resolvers are Available


### array *resolves to js array (which is an object really!)*

Resolves a string to an array, yes we know this is really an object in JS but it has a different API applied and allows different functions to be run on it, such as push(). For arguments sake, we will call it an array!

NOTE: Any property used in the resolvable data, if changed, will force a re-evaluation of the entire data!  

**Binding Type** One way on load
**Resolvable Data** [123, 'hello', method(), ['a', 'b']]
**Used By** Binders, alterers, configs and specials

```html
<span bind-???="[123, 'hello', method(), ['a', 'b'], true]"></span>
```


### boolean *resolves to js bool*

Resolves a string to boolean literal.

**Binding Type** One way on load
**Resolvable Data** true or false
**Used By** Binders, alterers, configs and specials

```html
<span bind-???="true"></span>
<span bind-???="false"></span>
```


### method *resolves to js function saved as a method property*

Resolves a string to function saved as a method property. You can send in any type of resolvable data you wish.

NOTE: Any property used in the resolvable data, if changed, will force a re-evaluation of the entire data!  

**Binding Type** One way on load
**Resolvable Data** someMethod('something', 123, true, [1,2,3])
**Used By** Binders, alterers, configs and specials

```html
<span bind-???="someMethod('something', 123, true, [1,2,3])"></span>
```


### number *resolves to js number*

Resolves a string to number literal.

**Binding Type** One way on load
**Resolvable Data** 1234
**Used By** Binders, alterers, configs and specials

```html
<span bind-???="123"></span>
<span bind-???="123.456"></span>
```


### object *resolves to js object*

Resolves a string to an object.

NOTE: Any property used in the resolvable data, if changed, will force a re-evaluation of the entire data!  

**Binding Type** One way on load
**Resolvable Data** {'key': 123, 'title': 'hello', 'method': method(), 'other': ['a', 'b']}
**Used By** Binders, alterers, configs and specials

```html
<span bind-???="{'key': 123, 'title': 'hello', 'method': method(), 'other': ['a', 'b']}"></span>
```


### phantom *resolves to js object/array value*

Resolves a string to a JS object/array value, in loops this is the current itteration, used to get access to child data in loops.

NOTE: Any property used in the resolvable data, if changed, will force a re-evaluation of the entire data in addition to the full resolved property path!  

**Binding Type** Two way
**Resolvable Data** $key or $value
**Used By** Binders, alterers, configs and specials
**Configure** Configure the names for the key and the value of arrays/objects (as in for binder)

```html
<span bind-???="$key" bind-???="$value"></span>
<span bind-???="$key" bind-???="$value.something['else']"></span>
<span bind-???="$idx" bind-???="$data" config-???="{'key': 'idx', 'value': 'data'}"></span>
```


### property *resolves to js property of model*

Resolves a string to a property in the JS model bound when instantiating razilobind. This can be dot or bracket notation, and can take in strings, numbers and properties as keys in brackets.

NOTE: Any property used in the resolvable data, if changed, will force a re-evaluation of the entire data in addition to the full resolved property path!  

**Binding Type** Two way
**Resolvable Data** foobar.bar['test']
**Used By** Binders, alterers, configs and specials
**Configure** Configure the names for the key and the value of arrays/objects (as in for binder)

```html
<span bind-???="foobar"></span>
<span bind-???="foobar.something['else']"></span>
<span bind-???="foobar[baz.bar['test']]"></span>
```


### string *resolves to js string*

Resolves a string to string literal.

**Binding Type** One way on load
**Resolvable Data** 'Hello World!'
**Used By** Binders, alterers, configs and specials

```html
<span bind-???="'Hello World'"></span>
```


## Making your own Resolvers


There are two ways to add your own resolvers to the library, by injecting them with the addResolvers() method bundled with razilobind, or if you have decided to import the core and have extended it, you may inject them along with all the other resolvers in the same fashion.

First off you will need a new resolver, you can start off by taking an existing resolver and copying it, changing the necessary parts. Lets call this **test.resolver.js**...

```javascript
import {RaziloBindResolver} from 'razilobind-resolver'

/**
 * Test Resolver
 * Resolves data as test
 *
 * Inherits
 *
 * property: data, node
 * method: detect(data) { return bool }
 */
export default class TestResolver extends Resolver {
	constructor(node) {
		super();
		this.node = node;
		this.name = 'test';
		this.regex = TestResolver.regex();
	}

	/**
	 * resolve()
	 * Resolve data to a number, set any observables on data
	 */
	resolve(object) {
		// object is the model to resolve against
		// this.node is the element you are currently working on (usefull if resolving iterations of a loop like phantom)
		// this.data is the data from the attribute to resolve

		var res = TestResolver.toTest(this.data); // resolve the data to a value and any observables
		this.resolved = res.resolved; // push the observables to this object
		this.observers = res.obeservers; // push the observables to this object
	}

	/**
	 * static regex()
	 * The pattern to test the data on, this should be clever enough to catch the data but not too in-depth, it will test attribute data
	 * Created as a static function to allow for easy testing from other resolvers
	 * @return object regex The regex used to validate if of type or not
	 */
	static regex() {
		return /^\'.*\'$/; // checks for a string ala 'string'
	}

	/**
	 * static toString()
	 * turns data into an actual string literal, yours should convert the data into the type you want it to be
	 * @param string data The data to resolve
	 * @return object {resolved: ..., observers:...} The resolved data and any observers needed to track future changes
	 */
	static toString(data) {
		// remove the quotes around the data (we know they are there because the regex must have them!)
		// do not set any obervers as literals do not have anything to watch
		// if you do set obervers, these should be dot notation only path to property (even if key has spaces or is a number)

		return {resolved: data.substring(1, data.length -1), observers: []};
	}
}
```

You can now import this into your project logic along with razilobind, injecting TestResolver into razilobind by adding custom resolver...


```javascript
import RaziloBind from 'razilobind'
import TestResolver from './test.resolver.js'

var model = {foo: 'foo', bar: 'bar'};

var rb = new RaziloBind();
rb.addResolvers({Test: TestResolver});
rb.bind('#test', model);
```

or if you have extended the core with your own class, you can add them as follows...


```javascript
import {RaziloBindCore, RaziloBindCoreDetector} from 'razilobind-core'
import {RaziloBindTrimAlterer, ...} from 'razilobind-alterer'
import {RaziloBindForBinder, ...} from 'razilobind-binder'
import {RaziloBindBooleanResolver, ...} from 'razilobind-resolver'
import TestResolver from './test.resolver.js'

export default class YourProjectBind extends RaziloBindCore {
    constructor(options) {
		super(options);

		// Inject injectables, pull in what you need!
		RaziloBindCoreDetector.defaultAlterers = {TrimAlterer: RaziloBindTrimAlterer, ...};
		RaziloBindCoreDetector.defaultBinders = {ForBinder: RaziloBindForBinder, ...};
		RaziloBindCoreDetector.defaultResolvers = {BooleanResolver: RaziloBindBooleanResolver, ...};

		// Inject custom injectables
		RaziloBindCoreDetector.customResolvers = {Test: TestBinder, ...};
	}
}
```


...either way will inject custom resolvers, should you wish to replace all default resolvers with your own custom ones, substitute the default injectables with your custom ones. Default injectables will also be parsed first, followed by custom ones, you choose how to and what to inject.


Once your new resolver is injected, you should be able to use it like so (don't forget strings are in quotes, miss the quotes and you will be sending a property in!)


Once thing to note, when injecting default resolvers yourself, ensure resolvers are in the correct order as per razilobind, for instance we need to detect true or false booleans before properties, or true and false will be seen as a property that cannot be found on the model i.e. undfined! If you are adding your own resolvers, be sure to order your resolvers so they do not get detected accidentally by others.... first one found is the first one used!


```html
<span bind-text="your-new-data-to-resolve"></span>
```
