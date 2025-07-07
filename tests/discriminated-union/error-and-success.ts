import {describe, expect, test} from '@jest/globals';
import Result ,{RESULT_T} from '../../src/result';

function resultMaker( which: "success" | "failure" ):RESULT_T<{prop1: string, prop2: string} , {message: string}>
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

describe('Testing for compatibility after generics support',()=>
{
	test("success has prop1 and prop2",()=>
	{
		const r = resultMaker("success");

		expect( r.ok ).toBe(true);

		if( r.ok && r.data)
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
		if( r.ng && r.data)
		{
			expect(r.data).toBeDefined();
			expect(r.data.message).toBeDefined();
		}
	});
});
