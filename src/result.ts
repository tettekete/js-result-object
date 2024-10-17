
interface Result_IF {
	data?: unknown;
	success: boolean;
	message?: string | null | undefined;
};


export type ResultMakerArgsT = [messageOrData?: unknown, data?: unknown];

/**
* Result Class
* 
* A class of objects representing simple “results”.
* Result objects can hold messages and data associated with “results”.
* 
* @example
* let r = Result.success();
* // r.ok === true
* // r.ng === false
* // r.message === "success"
* // r.data === undefined
* 
* let r2 = Result.failure( {foo: {bar : "buzz"}} );
* // r2.ok === false
* // r2.ng === true
* // r2.message === "failure"
* // r2.data === {foo: {bar : "buzz"}}
* 
* let r3 = Result.success( "You can fly!" ,{foo: {bar : "buzz"}} );
* // r3.ok === true
* // r3.ng === false
* // r3.message === "You can fly!"
* // r3.data === {foo: {bar : "buzz"}}
* 
*/

export default class Result
{
	private readonly _ok: boolean;
	private readonly _data: unknown;
	private readonly _message: string | null | undefined;
	
	get ok()		{ return this._ok }
	get ng()		{ return ! this._ok }
	get data()		{ return this._data }
	get message()	{ return this._message }
	
	/**
	* Constructor.
	* 
	* However, it cannot be called directly. 
	* Use Result.success() or Result.failure() instead.
	* 
	* @private
	* @param {Result_IF} args - Constructor argument object
	* @param {any} [args.data] - Result data (optional)
	* @param {string} [args.message] - Result message (optional)
	* @param {boolean} args.success - boolean value indicating success or failure of this object (required)
	*/
	private constructor({
		data
		,message
		,success
	}:Result_IF )
	{
		this._data = data;
		
		if( typeof message !== 'undefined' )
		{
			this._message		= message;	
		}
		
		this._ok	= success;
	}
	
	private static _arg_parser(
		success: boolean,
		messageOrData?: unknown,
		data?: unknown
	): Result_IF
	{
		const r: Result_IF =
		{
			success: success,
			message: success ? 'success' : 'failure'
		};
		
		if( typeof messageOrData === 'string')
			{
			/* construct pattern:
			( textMessage )
			( textMessage , dataObject )
			*/
			r.message	= messageOrData;
			r.data		= data ?? messageOrData;
		}
		else
		{
			/* construct pattern:
			()
			( dataObject )
			( undefined ,dataObject )
			( null ,dataObject )
			*/
			if( typeof data === 'undefined' )
			{
				r.data	= messageOrData;
			}
			else
			{
				r.data	= messageOrData ?? data;
			}
		}
		
		return r;
	}
	
	static success(
		...args: ResultMakerArgsT
	): Result
	{
		const [messageOrData, data] = args;
		return new Result( Result._arg_parser( true ,messageOrData,data ) );
	}
	
	static failure(
		...args: ResultMakerArgsT
	): Result
	{
		const [messageOrData, data] = args;
		return new Result( Result._arg_parser( false ,messageOrData,data ) );
	}
	
	error(): Error
	{
		const e = Error( this.message ?? 'Error' );
		e.name = "Result.error";
		return e;
	}
}
