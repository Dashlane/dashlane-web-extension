import React from 'react';
import { PersonalDataSectionView } from 'webapp/personal-data-section-view/personal-data-section-view';
import { PaymentsHeader } from 'webapp/payments/payments-header';
import { PaymentsContent } from 'webapp/payments/payments-content';
export const Payments = () => (<PersonalDataSectionView>
    <PaymentsHeader />
    <PaymentsContent />
  </PersonalDataSectionView>);
