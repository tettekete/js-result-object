
# @tettekete/result

`@tettekete/result` is a class of objects representing simple “results”.

# USAGE

```ts
import Result from '@tettekete/result';

// when CommonJS
// const Result = require('@tettekete/result').default;

const r = Result.success();
// r.ok === true
// r.ng === false
// r.message === "success"
// r.data === undefined

const r2 = Result.failure( {foo: {bar : "buzz"}} );
// r2.ok === false
// r2.ng === true
// r2.message === "failure"
// r2.data === {foo: {bar : "buzz"}}

const r3 = Result.success( "You can fly!" ,{foo: {bar : "buzz"}} );
// r3.ok === true
// r3.ng === false
// r3.message === "You can fly!"
// r3.data === {foo: {bar : "buzz"}}

// - - - - - - - -
// **Generics support(since version 1.1.0)**
type TokenSet = {
	idToken: string;
	refreshToken: string;
};

const r4 = Result.success<TokenSet>({idToken:"abc", refreshToken:"def"});
if( r4.data != null )
{
	// If the .data property is neither undefined nor null,
	// it is guaranteed to be of type "TokenSet".
	// Therefore, you can access "idToken" without any TypeScript warnings.
	console.log(`idToken: {r4.data.idToken}`);	// idToken: abc

	// Of course, you can also access it as `r4.data?.idToken`, or prepare
	// a type guard function for "TokenSet" to determine the type before
	// accessing it.
}
```

# Result

## Constructor

### `new` is private

You cannot directly instantiate it with `new`. Instead, use the class methods `success()` or `failure()`.

### `success( [messageOrData [, data ]] )`

Creates a `Result` instance that indicates success.

The following is a list of argument combinations and the data patterns returned by each accessor.

| messageOrData  | data           | .ok     | .ng     | .message  | .data          |
| -------------- | -------------- | ------- | ------- | --------- | -------------- |
| -              | -              | `true`  | `false` | "success" | `undefined`    |
| `"OK"`         | -              | `true`  | `false` | `"OK"`    | `"OK"`         |
| `"OK"`         | `{foo: "bar"}` | `true`  | `false` | `"OK"`    | `{foo: "bar"}` |
| `undefined`    | `{foo: "bar"}` | `true`  | `false` | "success" | `{foo: "bar"}` |
| `undefined`    | -              | `true`  | `false` | "success" | `undefined`    |
| `null`         | `{foo: "bar"}` | `true`  | `false` | "success" | `{foo: "bar"}` |
| `null`         | -              | `true`  | `false` | "success" | `null`         |
| `{foo: "bar"}` | -              | `true`  | `false` | "success" | `{foo: "bar"}` |



### `failure( [messageOrData [, data ]] )`

Creates a `Result` instance that indicates failure.

The following is a list of argument combinations and the data patterns returned by each accessor.。

| messageOrData  | data           | .ok     | .ng     | .message  | .data          |
| -------------- | -------------- | ------- | ------- | --------- | -------------- |
| -              | -              | `false` | `true`  | "failure" | `undefined`    |
| `"NG"`         | -              | `false` | `true`  | `"NG"`    | `"NG"`         |
| `"NG"`         | `{foo: "bar"}` | `false` | `true`  | `"NG"`    | `{foo: "bar"}` |
| `undefined`    | `{foo: "bar"}` | `false` | `true`  | "failure" | `{foo: "bar"}` |
| `undefined`    | -              | `false` | `true`  | "failure" | `undefined`    |
| `null`         | `{foo: "bar"}` | `false` | `true`  | "failure" | `{foo: "bar"}` |
| `null`         | -              | `false` | `true`  | "failure" | `null`         |
| `{foo: "bar"}` | -              | `false` | `true`  | "failure" | `{foo: "bar"}` |


## Accessor

### `ok`: boolean / readonly

Returns `true` if the instance was created by `Result.success()` and `false` if the instance was created by `Result.failure()`.


### `ng`: boolean / readonly

Returns `true` if the instance was created by `Result.failure()` and `false` if the instance was created by `Result.success()`.

### `message`: string / readonly

Returns the message passed to the constructor or the default message string.

The default is `success` and `failure` respectively.

### `data`: unknown / readonly

Returns the data passed to the constructor.

## Method

### `error()`: Error (experimental)

Returns an Error object using `this.message`.

This implementation is currently experimental. It may be discontinued or the specifications may change in the future.


