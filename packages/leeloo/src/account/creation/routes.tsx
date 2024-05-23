import * as React from 'react';
import { CustomRoute, RoutesProps } from 'libs/router';
import { Indicator } from './flow';
import { TopContainer } from './top-container/top-container';
export default function routes({ path, options, }: RoutesProps<string, {
    flowIndicator: Indicator;
}>): JSX.Element {
    return (<CustomRoute exact path={[path, `${path}/confirm`]} component={TopContainer} additionalProps={{ basePath: path }} options={options}/>);
}
