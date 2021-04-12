import { createReducer, on } from '@ngrx/store';
import { Error } from '../interfaces';
import { add, readAll } from '../errors/errors.actions';

const initialState: Error[] = [];

const _errorsReducer = createReducer(
    initialState,
    on(add, (state, { textInfo }) => state.concat({
            textInfo,
            readed: false
        }).reduce((acc, error) => {
            if(!acc.find(err => err.textInfo == error.textInfo)){
                acc.push(error);
            }
            return acc;
        }, [])
    ),
    on(readAll, state => state.map(error => {
        return { ...error, readed: true }
    }))
);

export function errorsReducer(state, action) {
    return _errorsReducer(state, action);
}