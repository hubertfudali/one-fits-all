import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { extractSinks } from 'cyclejs-utils';
import isolate from '@cycle/isolate';

import { driverNames } from '../drivers';
import { Sources, Sinks, Reducer, Component } from '../interfaces';

import { Counter, State as CounterState } from './counter';
import { Speaker, State as SpeakerState } from './speaker';

export interface State {
    counter?: CounterState;
    speaker?: SpeakerState;
}
export const defaultState: State = {
    counter: { count: 5 },
    speaker: undefined // use default state of component
};

export function App(sources: Sources<State>): Sinks<State> {
    const initReducer$ = xs.of<Reducer<State>>(
        prevState => (prevState === undefined ? defaultState : prevState)
    );

    const match$ = sources.router.define({
        '/counter': isolate(Counter, 'counter'),
        '/speaker': isolate(Speaker, 'speaker')
    });

    const componentSinks$ = match$
        .filter(({ path, value }: any) => path && typeof value === 'function')
        .map(({ path, value }: { path: string; value: Component<any> }) => {
            return value({
                ...sources,
                router: sources.router.path(path)
            });
        });

    const redirect$ = sources.router.history$
        .filter((l: Location) => l.pathname === '/')
        .mapTo('/counter');

    const sinks = extractSinks(componentSinks$, driverNames);
    return {
        ...sinks,
        router: xs.merge(redirect$, sinks.router),
        onion: xs.merge(initReducer$, sinks.onion)
    };
}
