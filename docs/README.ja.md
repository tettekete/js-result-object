
<p align="center"><a href="https://www.npmjs.com/package/@tettekete/result">English</a> / 日本語</p>

# @tettekete/result

`@tettekete/result` は、シンプルな「結果」を表すオブジェクトのためのクラスを提供します。

# 使い方

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
// version 1.1.0 よりジェネリクスをサポートしました
type TokenSet = {
	idToken: string;
	refreshToken: string;
};

// ジェネリクスを使って data プロパティーに格納されるデータの型を指定出来ます。
const r4 = Result.success<TokenSet>({idToken:"abc", refreshToken:"def"});

// ジェネリクスで TokenSet 型が指定されているため
// TokenSet 型であると TypeScript に推論され、型エラーや
// ワーニングなしにプロパティーへアクセスできます。

console.log(`idToken: {r4.data.idToken}`);	// idToken: abc

// ヒューマンエラーを想定する場合、型ガード関数を用いて TokenSet 型で
// あることをチェック、TypeScript に伝えた上で `idToken` プロパティーに
// アクセスする方がより安全ではあります。


// - - - - - - - -
// バージョン 1.2.0 より、判別可能な共用型（discriminated unions）のような使用方法をサポートしています。
function resultMaker( which: "success" | "failure" )
	:Result<
		{prop1: string, prop2: string},     // <-- 成功オブジェクトのための(data プロパティーの)型指定
		{message: string}                   // <-- 失敗オブジェクトのための(data プロパティーの)型指定
	>
{
	if( which === "success" )
	{
		return Result.success({prop1: "prop1", prop2: "prop2"} );
	}
	else
	{
		return Result.failure( {message: "failure"} );
	}
}

const successResult = resultMaker("success");
if( Result.isSuccess( r ) )
{
	console.log( r.data.prop1 );	// Access “prop1” without TypeScript warnings
}

const failureResult = resultMaker("failure");
if( Result.isFailure( r ) )
{
	console.log( r.data.message );	// Access "message" without TypeScript warnings
}

```

# Result

## Constructor

### `new` is private

`new` を使用して直接インスタンス化することはできません。代わりに、クラスメソッド `success()` または `failure()` を使用してください。

### `success<T>( [messageOrData [, data ]] )`

成功を示す `Result` インスタンスを作成して返します。

以下は呼び出し時の引数の組み合わせと各アクセサの値の組み合わせ表です。

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

失敗を示す `Result` インスタンスを作成して返します。

以下は呼び出し時の引数の組み合わせと各アクセサの値の組み合わせ表です。(仕様としては `success()` と同じです)

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

インスタンスが `Result.success()` によって作成された場合 `true` を返し、`Result.failure()` によって作成された場合 `false` を返します。


### `ng`: boolean / readonly

`ok` の逆の bool 値を返します。

### `message`: string / readonly

コンストラクタに渡されたメッセージまたはデフォルトのメッセージ文字列を返します。
デフォルトはそれぞれ `success` と `failure` です。

### `data`: unknown / readonly

コンストラクタに渡されたデータを返します。

## Instance Method

### `error()`: Error (experimental)

`this.message` を使用して Error オブジェクトを返します。
この実装は現在実験的です。将来的に廃止されるか、仕様が変更される可能性があります。


## Class Method

### `isSuccess( resultObject: Result<T,E> )`

`Result.isSuccess()` は、与えられた` Result<T, E>` が成功状態（`ok: true`）であるかを判定します。
この関数は 型ガードとして機能し、成功時の型 `T` に自動的に絞り込みます。

このメソッドを使用することで、`if` 文の条件内で `Result<T,E>` の型を成功時の構造（`Result<T, never>`）へと安全に絞り込むことができ、`data` プロパティなどへのアクセス時に補完や型チェックが有効になります。


**サンプルコード:**

```ts
const result = Result.success({ token: 'abc123' });

if (Result.isSuccess(result)) {
  // result の型: Result<{ token: string }, never>
  console.log(result.data.token); // 補完・型検査が有効
}
```


### `isFailure( resultObject: Result<T,E> )`

`Result.isSuccess()` は、与えられた` Result<T, E>` が成功状態（`ok: false`）であるかを判定します。
この関数は 型ガードとして機能し、成功時の型 `E` に自動的に絞り込みます。

このメソッドを使用することで、`if` 文の条件内で `Result<T,E>` の型を成功時の構造（`Result<never, E>`）へと安全に絞り込むことができ、`data` プロパティなどへのアクセス時に補完や型チェックが有効になります。

**サンプルコード:**

```ts
const result = Result.failure('Token expired', new Error('401 Unauthorized'));

if (Result.isFailure(result)) {
  // result の型: Result<never, Error>
  console.error(result.message);
  console.error(result.data.message); // Error 型として補完される
}
```
