import { jsx } from '@dashlane/ui-components';
import styles from './styles.css';
import { ConsolePage } from 'team/page';
type GroupPageProps = React.PropsWithChildren<{
    header: JSX.Element;
}>;
export const GroupPage = ({ header, children }: GroupPageProps) => (<ConsolePage header={header}>
    <div className={styles.content}>{children}</div>
  </ConsolePage>);
