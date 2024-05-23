import { jsx } from '@dashlane/design-system';
import { AppGroup, AppGroupSection } from './app-group';
import { AppLinkListItem } from './app-link-list-item';
import { DELETE_ACCOUNT_URL_SEGMENT, RESET_ACCOUNT_URL_SEGMENT, } from '../../constants';
export const AppLinkList = () => {
    return (<ul>
      <AppGroup label="WAC">
        <AppGroupSection>
          <AppLinkListItem to="account" content="WAC B2C" extraContent="Root, links to nothing"/>
        </AppGroupSection>

        <AppGroupSection>
          <AppLinkListItem to="account/create" content="WAC B2C / create" extraContent="Dashlane Account creation form"/>
          <AppLinkListItem to="*****" content="WAC B2C / create" extraContent="(same with a pre-filled email)"/>
        </AppGroupSection>
      </AppGroup>

      <AppGroup label="TOC">
        <AppGroupSection>
          <AppLinkListItem to="member/create" content="TOC B2B / member / create" extraContent="Dashlane Business Team joining form)"/>
          <AppLinkListItem to="*****" content="TOC B2B / member / create" extraContent="(same with a pre-filled email)"/>
        </AppGroupSection>

        <AppGroupSection>
          <AppLinkListItem to="team/create" content="TOC B2B / team / create" extraContent="Dashlane Business Team creation form"/>
          <AppLinkListItem to="*****" content="TOC B2B / team / create" extraContent="(same with a pre-filled email)"/>
        </AppGroupSection>
      </AppGroup>

      <AppGroup label="Family">
        <AppGroupSection>
          <AppLinkListItem to="family/join" content="Family / join" extraContent="Join Dashlane Family form"/>
        </AppGroupSection>

        <AppGroupSection>
          <AppLinkListItem to="client/family-dashboard" content="Family Dashboard"/>
        </AppGroupSection>
      </AppGroup>

      <AppGroup label="Miscellaneous">
        <AppGroupSection>
          <AppLinkListItem to="*****" content="Download" extraContent="Download Dashlane page" asAnchor={true}/>
        </AppGroupSection>

        <AppGroupSection>
          <AppLinkListItem to="client/notifications" content="Notifications"/>
        </AppGroupSection>

        <AppGroupSection>
          <AppLinkListItem to={DELETE_ACCOUNT_URL_SEGMENT} content="Delete Account"/>
        </AppGroupSection>
        <AppGroupSection>
          <AppLinkListItem to={RESET_ACCOUNT_URL_SEGMENT} content="Reset Account"/>
        </AppGroupSection>
      </AppGroup>
    </ul>);
};
