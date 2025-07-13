
interface Result_IF<T = unknown ,E = unknown> {
	data?: T | E;
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

export default class Result<T = unknown ,E = unknown>
{
	private readonly _ok: boolean;
	private readonly _data: T | E;
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
	* @param {unknown} [args.data] - Result data (optional)
	* @param {string | null | undefined} [args.message] - Result message (optional)
	* @param {boolean} args.success - boolean value indicating success or failure of this object (required)
	*/
	private constructor({
		data
		,message
		,success
	}:Result_IF<T,E> )
	{
		this._data = data as T | E;
		
		if( typeof message !== 'undefined' )
		{
			this._message		= message;	
		}
		
		this._ok	= success;
	}

	
	static success(): Result<undefined>;
	static success(message: string): Result<string>;
	static success<T>(data: T): Result<T,never>;
	static success<T>(message: string, data: T): Result<T,never>;
	static success<T>(message: undefined | null, data: T): Result<T,never>;
	static success<T>(message: unknown, data: unknown ): Result<T,never>;
	static success<T>(messageOrData?: string | T, data?: T): Result<T,never>
	{
		const rArgs: Result_IF<T,never> =
		{
			success: true,
			message: 'success'
		};
		
		if( messageOrData === undefined && data === undefined )
		{
			/* construct pattern: () */
			rArgs.data = undefined as T;
		}
		else if( typeof messageOrData === 'string' )
		{
			rArgs.message	= messageOrData as string;

			if( data === undefined )
			{
				/* construct pattern: ( textMessage ) */
				rArgs.data		= messageOrData as T;
			}
			else
			{
				/* construct pattern: ( textMessage , dataObject ) */
				rArgs.data		= data as T;
			}
		}
		else
		{
			if( data === undefined )
			{
				/* construct pattern(that 1 arg):
					( undefined | null )
					( dataObject )
				*/
				rArgs.data		= messageOrData as T;
			}
			else
			{
				/* construct pattern: ( undefined | null , undefined  ) */
				rArgs.data		= data as T;
			}
		}

		return new Result( rArgs );
	}


	static failure(): Result<never ,undefined>;
	static failure(message: string): Result<never ,string>;
	static failure<E>(data: E): Result<never ,E>;
	static failure<E>(message: string, data: E): Result<never ,E>;
	static failure<E>(message: undefined | null, data: E): Result<never ,E>;
	static failure<E>(message: unknown, data: unknown ): Result<never ,E>;
	static failure<E>(messageOrData?: string | E, data?: E): Result<never ,E>
	{
		const rArgs: Result_IF<never,E> =
		{
			success: false,
			message: 'failure'
		};
		
		if( messageOrData === undefined && data === undefined )
		{
			/* construct pattern: () */
			rArgs.data = undefined as E;
		}
		else if( typeof messageOrData === 'string' )
		{
			rArgs.message	= messageOrData as string;

			if( data === undefined )
			{
				/* construct pattern: ( textMessage ) */
				rArgs.data		= messageOrData as E;
			}
			else
			{
				/* construct pattern: ( textMessage , dataObject ) */
				rArgs.data		= data as E;
			}
		}
		else
		{
			if( data === undefined )
			{
				/* construct pattern(that 1 arg):
					( undefined | null )
					( dataObject )
				*/
				rArgs.data		= messageOrData as E;
			}
			else
			{
				/* construct pattern: ( undefined | null , undefined  ) */
				rArgs.data		= data as E;
			}
		}

		return new Result( rArgs );
	}
	
	error(): Error
	{
		const e = Error( this.message ?? 'Error' );
		e.name = "Result.error";
		return e;
	}

	
	static isSuccess<T,E>( r: Result<T,E> ): r is Result<T, never>
	{
		return r.ok;
	}


	static isFailure<T,E>( r: Result<T,E> ): r is Result<never, E>
	{
		return r.ng;
	}
}
