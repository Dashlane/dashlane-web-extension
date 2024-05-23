import React from 'react';
import { Website } from '@dashlane/vault-contracts';
import DetailField from 'libs/dashlane-style/detail-field';
import { TrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import GenericForm, { isNotEmpty } from 'webapp/personal-data/edit/form/common';
import { SpaceSelect, spaceSelectFormLabelSx, } from 'webapp/space-select/space-select';
export type WebsiteFormEditableValues = Pick<Website, 'itemName' | 'URL' | 'spaceId'>;
export class WebsiteForm extends GenericForm<WebsiteFormEditableValues> {
    static contextType = TrialDiscontinuedDialogContext;
    public isFormValid(): boolean {
        return this.validateValues({
            URL: isNotEmpty,
        });
    }
    public render() {
        const _ = this.props.lee.translate.namespace('webapp_personal_info_edition_website_');
        const { shouldShowTrialDiscontinuedDialog: isDisabled } = this.context;
        return (<>
        <DetailField key={'website'} label={_('website_label')} placeholder={_('placeholder_no_website')} dataName="URL" value={this.state.values.URL} error={this.state.errors.URL} onChange={this.handleChange} disabled={!!isDisabled}/>

        <DetailField key={'name'} label={_('name_label')} placeholder={_('placeholder_no_name')} dataName="itemName" value={this.state.values.itemName} onChange={this.handleChange} disabled={!!isDisabled}/>

        <SpaceSelect labelSx={spaceSelectFormLabelSx} spaceId={this.state.values.spaceId ?? ''} onChange={(newSpaceId) => this.handleChange(newSpaceId, 'spaceId')} disabled={!!isDisabled}/>
      </>);
    }
}
