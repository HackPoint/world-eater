import { Observable } from 'rxjs';

export interface Profile {
  readonly id: string;
  readonly name: string;
  readonly avatarUrl: string;
}
export type InferMappedType<T> =
  T extends Observable<infer R> ? R : never;
