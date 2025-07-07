
export type RESULT_T<T,E = unknown> =
| {readonly ok: true, readonly ng: false, readonly data?: T | undefined, readonly message: string}
| {readonly ok: false, readonly ng: true, readonly data?: E | undefined, readonly message: string}
;

export default class Result<T, E = unknown>
{
	static success<T>(data?: T): RESULT_T<T, never>;
	static success<T>(message: string, data?: T): RESULT_T<T, never>;
	static success<T>(message: undefined | null, data?: T): RESULT_T<T, never>;
	static success<T>(messageOrData?: string | T, data?: T): RESULT_T<T | undefined, never>
	{
		return {
			ok: true,
			ng: false,
			data: (data ?? messageOrData) as T,
			message: typeof messageOrData === 'string' ? messageOrData : 'success'
		} as const;
	}

	static failure<E>(data?: E): RESULT_T<never, E>;
	static failure<E>(message: string, data?: E): RESULT_T<never, E>;
	static failure<E>(message: undefined | null, data?: E): RESULT_T<never, E>;
	static failure<E>(messageOrData?: string | E, data?: E): RESULT_T<never, E | undefined>
	{
		return {
			ok: false,
			ng: true,
			data: (data ?? messageOrData) as E,
			message: typeof messageOrData === 'string' ? messageOrData : 'failure'
		} as const;
	}
}
