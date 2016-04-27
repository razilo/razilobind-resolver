# raziloBind - Resolvers ES6 JS/HTML Binding Library

## What is raziloBind?


ES6 JS/HTML binding library for creating dynamic web applications through HTML attribute binding. Made up of 4 libraries, puled in via a parent package that pulls in all required parts and configures as importable ES6 module 'RaziloBind'.

* **[razilobind-core](https://github.com/smiffy6969/razilobind-core)** *(the main part)*, to traverse, detect and observe.
* **[razilobind-binder](https://github.com/smiffy6969/razilobind-binder) [injectables]** *(the actual binders)*, binding object properties to elements to do various things.
* **[razilobind-resolver](https://github.com/smiffy6969/razilobind-resolver) [injectables]** *(to parse attribute data)*, resolving attribute data to things like strings, numbers, objects, methods etc.
* **[razilobind-alterer](https://github.com/smiffy6969/razilobind-alterer) [injectables]** *(to change things)*, altering resolved data to something else without affecting the model.

This package **razilobind-core**, is the base functionality that binds, observes, traverses and detects, allowing injectables to be used on dom elements.


## What are Resolvers?



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
