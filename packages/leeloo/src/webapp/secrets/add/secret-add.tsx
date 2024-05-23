import { connect } from 'libs/carbonApiConsumer';
import { remoteDataAdapter } from 'libs/remoteDataAdapter';
import { Props, SecretAddPanelComponent } from './secret-add-component';
interface InjectedProps {
}
const selectors = {};
const remoteDataConfig = {
    strategies: selectors,
};
export const SecretAddPanel = connect(remoteDataAdapter<InjectedProps, Props>(SecretAddPanelComponent, remoteDataConfig), selectors);
