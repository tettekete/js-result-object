
<p align="center">English / <a href="https://tettekete.github.io/js-result-object/README.ja.html">日本語</a></p>

# @tettekete/result

`@tettekete/result` provides a class that represents simple "results".

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
// r2.data === { foo: { bar: "buzz" } }

const r3 = Result.success("You can fly!", { foo: { bar: "buzz" } });
// r3.ok === true
// r3.ng === false
// r3.message === "You can fly!"
// r3.data === {foo: {bar : "buzz"}}

// - - - - - - - -
// Generics support (since version 1.1.0)
type TokenSet = {
  idToken: string;
  refreshToken: string;
};

// You can use generics to specify the type of data stored in the `data` property.
const r4 = Result.success<TokenSet>({ idToken: "abc", refreshToken: "def" });

// Since the generic type `TokenSet` is specified,
// TypeScript infers that `r4.data` is of type `TokenSet`,
// so you can access its properties without any type errors or warnings.

console.log(`idToken: {r4.data.idToken}`); // idToken: abc

// If you want to guard against human error,
// you can use a type guard function to verify that the value is a `TokenSet`,
// and explicitly inform TypeScript before accessing its properties for added safety.

// - - - - - - - -
// Since version 1.2.0, discriminated union-like usage is supported.
function resultMaker(
  which: "success" | "failure"
): Result<
  { prop1: string; prop2: string }, // <-- data type for success
  { message: string }               // <-- data type for failure
> {
  if (which === "success") {
    return Result.success({ prop1: "prop1", prop2: "prop2" });
  } else {
    return Result.failure({ message: "failure" });
  }
}

const successResult = resultMaker("success");
if (Result.isSuccess(successResult)) {
  console.log(successResult.data.prop1); // Access "prop1" without TypeScript warnings
}

const failureResult = resultMaker("failure");
if (Result.isFailure(failureResult)) {
  console.log(failureResult.data.message); // Access "message" without TypeScript warnings
}
```

# Result

## Constructor

### `new` is private

You cannot instantiate this class directly using `new`. Instead, use the static methods `success()` or `failure()`.

### `success<T>( [messageOrData [, data ]] )`

Creates a `Result` instance indicating success.

The table below shows combinations of arguments and how each accessor behaves:

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



### `failure<E>( [messageOrData [, data ]] )`

Creates a `Result` instance indicating failure.

The table below shows combinations of arguments and how each accessor behaves (identical to `success()`):

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

Returns `true` if the instance was created by `Result.success()`, `false` if by `Result.failure()`.

### `ng`: boolean / readonly

Returns the inverse of `ok`.

### `message`: string / readonly

Returns the message passed to the constructor or a default message. The default is `"success"` or `"failure"`.

### `data`: unknown / readonly

Returns the data passed to the constructor.

## Instance Method

### `error()`: Error (experimental)

Returns an `Error` object using `this.message`.
This feature is experimental and may be modified or removed in the future.

## Class Method

### `isSuccess(resultObject: Result<T, E>)`

Returns whether the given `Result<T, E>` is in the success state (`ok: true`).

This method is a type guard that narrows the type of the result to `Result<T, never>` upon success. This allows code completion and type checking for the `data` property and others.

**Example:**

```ts
const result = Result.success({ token: 'abc123' });

if (Result.isSuccess(result)) {
  // Type of result: Result<{ token: string }, never>
  console.log(result.data.token); // Completion and type checking are active
}
```

### `isFailure(resultObject: Result<T, E>)`

Returns whether the given `Result<T, E>` is in the failure state (`ok: false`).

This method is a type guard that narrows the type of the result to `Result<never, E>` upon failure. This allows code completion and type checking for the `data` property and others.

**Example:**

```ts
const result = Result.failure('Token expired', new Error('401 Unauthorized'));

if (Result.isFailure(result)) {
  // Type of result: Result<never, Error>
  console.error(result.message);
  console.error(result.data.message); // Inferred as Error
}
```
