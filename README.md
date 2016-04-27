# raziloBind - Resolvers ES6 JS/HTML Binding Library

## What is raziloBind?


ES6 JS/HTML binding library for creating dynamic web applications through HTML attribute binding. Made up of 4 libraries, puled in via a parent package that pulls in all required parts and configures as importable ES6 module 'RaziloBind'.

* **[https://github.com/smiffy6969/razilobind-core](razilobind-core)** *(the main part)*, to traverse, detect and observe.
* **[https://github.com/smiffy6969/razilobind-binder](razilobind-binder) [injectables]** *(the actual binders)*, binding object properties to elements to do various things.
* **[https://github.com/smiffy6969/razilobind-resolver](razilobind-resolver) [injectables]** *(to parse attribute data)*, resolving attribute data to things like strings, numbers, objects, methods etc.
* **[https://github.com/smiffy6969/razilobind-alterer](razilobind-alterer) [injectables]** *(to change things)*, altering resolved data to something else without affecting the model.

This package **razilobind-core**, is the base functionality that binds, observes, traverses and detects, allowing injectables to be used on dom elements.


## What are Resolvers?

Alterers are a way to change the end result of bound data that has been resolved. Simply, we create a bind (to do a thing), resolve the data in the bind (to know what to bind), then alter the resolved data if we wish. Alterers are the last point of that chain.

Alterers change the resolved data before using it in the binded element in the fashion it was intended to be used, such as trimming whitespace on strings, or formtatting dates. Substitue ??? for the binder you wish to alter the data on `alter-*=""`, such as alter-text, alter-show... with the alterer/s specified in attribute value such as

Alterers are linked to the binder you wish to change, and they take in any resolvable data, [https://github.com/smiffy6969/razilobind-resolver](see here for what types of resolvable data can be used).


```html
<!-- single alterer which gets the alterer type from the bound foobar property of the model -->
<p bind-text="foobar" alter-text="foobar"></p>

<!-- single alterer (as a string value) -->
<p bind-text="foobar" alter-text="'trim'"></p>

<!-- multiple alterers (as a strings or property) affects accumulate in order -->
<p bind-text="foobar" alter-text="['trim', 'another', foobar,...]"></p>

<!-- alterers with options (send in data to the alterer) -->
<p bind-text="foobar" alter-text="{'trim': 'options', 'another': ['options'],...}"></p>
```


NOTE: We don't link arbitary functions to an alterer, if you bind a property or a method, it will use the result of this to look for the alterer to use! If you want custom alterers, then define this as correct alterers and inject them into the tool correctly, see how further down.


## What Alterers are Available



## Making your own Alterers












Resolvers for ES6 JS/HTML binding library for creating cynamic web applications through HTML attribtue binding. Pulls in all required parts and configures as RaziloBind

A data binding library to bind ES6 JS to HTML views thorugh HTML attributes, offering live changes to update modules and vice versa.

Data that can be resolved when using with HTML bindable attributes. Resolvers work on binders, alterers and configs.

* array - one time bindable array, or updatable embedded properties. "['literal', updatable.object['data'], method(), ...]"
* object - one time bindable object, or updatable embedded properties, methods. "{'literal': 'data', 'updatable': object['data'], 'a-method': method(), ...}"
* string - one time literal "'literal'"
* number - one time number "12345"
* boolean - one time boolean "true" or "false"
* property - updatable model value "foo.bar['baz']", "foo[foobar['baz']]", ...
* method - updatable model method "foo&#40;'test'&#41;", "foo&#91;foobar&#91;'baz'&#93;&#93;&#40;foobar&#41;", "foo.bar({object['data']: 'data'})", NOTE: updates only if method changes or method variables are properties as either will force re-evaluation...
* phantom - updateble property that resolves to an iterable instance. Turns arrays/object keys/properties into phantom properties (defaults $key, $value, can be changed in binder configs that use phantoms
