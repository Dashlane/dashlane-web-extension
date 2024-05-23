import { Children, ReactElement, ReactNode } from 'react';
import { jsx } from '@dashlane/design-system';
interface Props {
    children: ReactNode;
    title?: ReactNode;
    isCollapsed?: boolean;
    className?: string;
}
export const SidemenuSection = ({ children, title, isCollapsed = false, className, }: Props) => (<section className={className}>
    {title ? (<div sx={{
            visibility: isCollapsed ? 'hidden' : 'visible',
            marginLeft: '14px',
            marginBottom: '8px',
            textTransform: 'uppercase',
        }}>
        {title}
      </div>) : null}
    <ul>
      {Children.toArray(children).map((childElement, index) => {
        const { props } = childElement as ReactElement;
        const key = props.to ||
            props.id ||
            props.collection?.id ||
            `sideMenu_section_${title}_${index}`;
        return <li key={key}>{childElement}</li>;
    })}
    </ul>
  </section>);
