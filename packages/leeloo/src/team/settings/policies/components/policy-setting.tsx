import { Badge, DSStyleObject, Heading, Infobox, jsx, } from '@dashlane/design-system';
import { CtaButton } from 'team/settings/components/cta-button';
import { SX_STYLES } from '../constants';
import { SettingField, SettingFieldProps, SettingSelectField, SettingTextField, } from '../types';
import { PolicyTextField } from './policy-text-field';
import { PolicySelectField } from './policy-select-field';
import { PolicySwitchField } from './policy-switch-field';
export type PolicySettingProps = SettingFieldProps & {
    field: SettingField;
};
const FieldInput = (props: PolicySettingProps) => {
    const { field, ...rest } = props;
    switch (field.type) {
        case 'text':
            return <PolicyTextField field={field as SettingTextField} {...rest}/>;
        case 'select':
            return (<PolicySelectField field={field as SettingSelectField} {...rest}/>);
        case 'switch':
            return <PolicySwitchField {...props}/>;
        case 'cta':
            return <CtaButton onClick={field.ctaAction} content={field.ctaLabel}/>;
        default:
            return null;
    }
};
export const PolicySetting = (props: PolicySettingProps) => {
    const rowStyle: DSStyleObject = {
        '> *': {
            flex: '1',
        },
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginBottom: '32px',
    };
    const { field } = props;
    switch (field.type) {
        case 'text':
            rowStyle.marginTop = '7px';
            break;
        case 'select':
            rowStyle.marginTop = '4px';
            break;
        case 'switch':
            rowStyle.marginTop = '20px';
            break;
        case 'cta':
            rowStyle.marginTop = '20px';
            break;
    }
    return (<div key={field.feature} sx={rowStyle}>
      <div sx={{ maxWidth: '50%' }}>
        <div sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
        }}>
          <Heading as="h3" textStyle="ds.title.block.medium" color="ds.text.neutral.catchy" sx={field.type === 'select' || field.type === 'text'
            ? SX_STYLES.SETTINGS_LABEL_MARGIN_TOP
            : {}} id={field.feature}>
            {field.label.split('//').map((labelFragment, index) => {
            if (index % 2) {
                return (<span key={labelFragment} sx={{ color: 'ds.text.oddity.disabled', fontWeight: '300' }}>
                    {labelFragment}
                  </span>);
            }
            else {
                return labelFragment;
            }
        })}
          </Heading>
          {field.badgeLabel ? (<Badge label={field.badgeLabel} mood="brand" iconName={field.badgeIconName} layout="iconLeading"/>) : null}
        </div>
        {field.helperLabel ? (<div id="helper-label-panel" sx={SX_STYLES.HELPER_LABEL_PANEL}>
            {field.helperLabel}
          </div>) : null}
        {field.infoBox ? (<div sx={{ marginTop: '20px' }}>
            <Infobox size="large" title={field.infoBox.title} description={field.infoBox.description} mood={field.infoBox.mood ?? 'neutral'}/>
          </div>) : null}
      </div>
      <FieldInput {...props}/>
    </div>);
};
