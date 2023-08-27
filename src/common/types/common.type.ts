export type Nullable<T> = T|null;
export type Optional<T> = T|undefined;

export declare type MemberSelector<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
export declare type MethodSelector<T> = { [K in keyof T as T[K] extends Function ? K : never]: T[K] };