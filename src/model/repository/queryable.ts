export type EqualityOperator = 'eq' | 'ne'
export type RelationalOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq'
export type PredicateOperator = EqualityOperator | RelationalOperator
export type Queryable<T> = Record<Partial<keyof T>, [PredicateOperator]>
