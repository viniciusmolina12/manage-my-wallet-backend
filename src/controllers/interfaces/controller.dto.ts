export interface InputControllerDto<T> {
    data: T
}

type ControllerStatusCode = 200 | 201 | 400 | 401 | 404 | 500;

export interface OutputControllerDto<T> {
    data?: T
    code: ControllerStatusCode
    message?: string 
}
