import { QmkKeyboard } from "../interfaces";

export interface GetQmkKeyboardResponse {
    keyboards: {
        [keyboardModel: string]: QmkKeyboard
    }
}

export interface compileFirmwareResponse {
    enqueued: boolean,
    job_id: string,
    finished: boolean
}

export interface checkStatusResponse {
    created_at: string,
    enqueued_at: string,
    id: string,
    status: string,
    result: any
}


