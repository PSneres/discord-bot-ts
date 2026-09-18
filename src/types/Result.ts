export type Result<T> = 
|  { success: true, data: T}
|  { succes: false, error: string}