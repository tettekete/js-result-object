import {describe, expect, test} from '@jest/globals';
import Result from '../src/result';


describe('Throws an exception when assigning to a ReadOnly member.',()=>
{
	const r = Result.success("OK","Hello");

	test("ok is read only",()=>
	{
		expect(()=>
		{
			// @ts-ignore
			r.ok = false;
		}).toThrow();
	});

	test("ng is read only",()=>
	{
		expect(()=>
		{
			// @ts-ignore
			r.ng = false;
		}).toThrow();
	});

	test("message is read only",()=>
	{
		expect(()=>
		{
			// @ts-ignore
			r.message = "SUCCSESS";
		}).toThrow();
	});

	test("data is read only",()=>
	{
		expect(()=>
		{
			// @ts-ignore
			r.data = "See you again";
		}).toThrow();
	});
	
});

let index = 0;
describe.each([
	{f: ()=>{return Result.success()}						,b: true	,m: "success" ,o: undefined },
	{f: ()=>{return Result.success("OK")}					,b: true	,m:"OK" ,o: "OK" },
	{f: ()=>{return Result.success("OK",{foo: "bar"})}		,b: true	,m:"OK" ,o: {foo: "bar"}},
	{f: ()=>{return Result.success(undefined,{foo: "bar"})}	,b: true	,m:"success" ,o: {foo: "bar"}},
	{f: ()=>{return Result.success(undefined)}				,b: true	,m:"success" ,o: undefined },
	{f: ()=>{return Result.success(null,{foo: "bar"})}		,b: true	,m:"success" ,o: {foo: "bar"}},
	{f: ()=>{return Result.success(null)}					,b: true	,m:"success" ,o: null},
	{f: ()=>{return Result.success({foo: "bar"})}			,b: true	,m:"success" ,o: {foo: "bar"}},
	{f: ()=>{return Result.failure()}						,b: false	,m:"failure" ,o: undefined},
	{f: ()=>{return Result.failure("NG")}					,b: false	,m:"NG" ,o: "NG"},
	{f: ()=>{return Result.failure("NG",{foo: "bar"})}		,b: false	,m:"NG" ,o: {foo: "bar"}},
	{f: ()=>{return Result.failure(undefined,{foo: "bar"})}	,b: false	,m:"failure" ,o: {foo: "bar"}},
	{f: ()=>{return Result.failure(undefined)}				,b: false	,m:"failure" ,o: undefined},
	{f: ()=>{return Result.failure(null,{foo: "bar"})}		,b: false	,m:"failure" ,o: {foo: "bar"}},
	{f: ()=>{return Result.failure(null)}					,b: false	,m:"failure" ,o: null},
	{f: ()=>{return Result.failure({foo: "bar"})}			,b: false	,m:"failure" ,o: {foo: "bar"}},

])('All construct patterns',({f,b,m,o}) =>
{
	index++;
	test(`${index}:コンストラクタで例外スローしない`,()=>
	{
		expect( f ).not.toThrow();
	});
	
	const r = f();
	test(`${index}:ブール評価が ${b} である`,()=>
	{
		if( b )
		{
			expect( r.ok ).toBeTruthy();
			expect( r.ng ).toBeFalsy();
		}
		else
		{
			expect( r.ok ).toBeFalsy();
			expect( r.ng ).toBeTruthy();
		}
	});
	
	test(`${index}:message が "${m}" である`,()=>
	{
		expect( r.message ).toBe( m );
	});
	
	test(`${index}:data が期待値通りである`,()=>
	{
		expect( JSON.stringify(r.data) ).toEqual( JSON.stringify( o ) );
		// assert.deepEqual( r.data , o );
	});
});

