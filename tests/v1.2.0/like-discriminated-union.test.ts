import {describe, expect, test} from '@jest/globals';
import Result from '../../src/result';

function resultMaker( which: "success" | "failure" ):Result<{prop1: string, prop2: string},{message: "failure"}>
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

describe('Support usage such as discriminated union.',()=>
{
	test("success has prop1 and prop2",()=>
	{
		const r = resultMaker("success");

		expect( r.ok ).toBe(true);

		if( Result.isSuccess( r ) )
		{
			expect(r.data).toBeDefined();
			expect(r.data.prop1).toBeDefined();
			expect(r.data.prop2).toBeDefined();
		}
	});

	test("failure has message",()=>
	{
		const r = resultMaker("failure");

		expect( r.ng ).toBe(true);

		if( Result.isFailure( r ) )
		{
			expect(r.data).toBeDefined();
			expect(r.data.message).toBeDefined();
		}
	});
});
