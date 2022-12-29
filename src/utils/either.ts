type Failure<E> = {
  readonly _tag: 'Failure'
  readonly failure: E
}

type Success<A> = {
  readonly _tag: 'Success'
  readonly success: A
}

type Either<E, A> = Failure<E> | Success<A>

const isFailure = <E, A>(ma: Either<E, A>): ma is Failure<E> => ma?._tag === 'Failure'

const isSuccess = <E, A>(ma: Either<E, A>): ma is Success<A> => ma?._tag === 'Success'

const failure = <E = never, A = never>(e: E): Either<E, A> => ({
  _tag: 'Failure',
  failure: e,
})

const success = <E = never, A = never>(a: A): Either<E, A> => ({
  _tag: 'Success',
  success: a,
})

export { Either, isFailure, isSuccess, failure, success }
