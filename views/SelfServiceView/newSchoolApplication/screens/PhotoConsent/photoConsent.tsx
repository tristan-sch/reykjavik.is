import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

import { WizardScreenRenderProps } from 'components/SelfService/types/types';
import { NewSchoolApplicationExternalData } from 'views/SelfServiceView/newSchoolApplication/types/newSchoolApplicationTypes';
import { CmsContent } from 'components/CmsContent/CmsContent';
import { Box } from 'components/Box/box';
import Alert from '@reykjavik/hanna-react/Alert';
import { Text } from 'components/Text/text';
import TextButton from '@reykjavik/hanna-react/TextButton';
import { BlingModal } from 'components/SelfService/BlingModal/blingModal';
import VSpacer from '@reykjavik/hanna-react/VSpacer';
import { FieldRadioGroup } from 'components/SelfService/Fields/Radios/FieldRadioGroup/FieldRadioGroup';
import { StyledAlert, StyledWrapper } from './photoConsent.styles';

type Props = WizardScreenRenderProps & {
  externalData?: NewSchoolApplicationExternalData;
};

export const PhotoConsentScreen = (props: Props) => {
  const { t } = useTranslation(['newSchoolApplication', 'selfServiceForm']);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const externalData = props.externalData as NewSchoolApplicationExternalData;
  const { cmsData } = externalData;

  return (
    <>
      <Text.Heading size="small" Tag="h2" mt={0}>
        {cmsData.photoConsent.contentTitle}
      </Text.Heading>
      {cmsData.photoConsent.content.length > 0 && (
        <CmsContent content={cmsData.photoConsent.content[0].content} />
      )}

      <VSpacer size="small" />
      <Box mb={44}>
        <StyledAlert>
          <Alert type="info">
            <Box display="inline-block" mr={5}>
              <TextButton onClick={() => setModalIsOpen(true)}>
                {t('newSchoolApplication:steps.photoConsent.rulesStatement.link')}
              </TextButton>
            </Box>
            {t('newSchoolApplication:steps.photoConsent.rulesStatement.text')}
          </Alert>
        </StyledAlert>
      </Box>
      {cmsData.photoConsent.content.length >= 1 && (
        <BlingModal open={modalIsOpen} onClosed={() => setModalIsOpen(false)}>
          <CmsContent wide content={cmsData.photoConsent.content[1].content} />
        </BlingModal>
      )}

      <Box pt={40} px={[32, 40]} pb={16} mb={16} backgroundColor="SULD_25">
        <Text.SubHeading small startSeen m={0} fontSize={20} color="SULD_200">
          {t('newSchoolApplication:steps.photoConsent.consentBox.title')}
        </Text.SubHeading>
        <Text.TextBlock startSeen m={0} fontSize={16}>
          {t('newSchoolApplication:steps.photoConsent.consentBox.description')}
        </Text.TextBlock>

        <StyledWrapper>
          <FieldRadioGroup
            id="photoConsent"
            options={[
              {
                value: `${t('shared.yes', { ns: 'selfServiceForm' })}`,
                id: 'photoConsentYes',
                label: `${t('newSchoolApplication:steps.photoConsent.consentBox.yes')}!`,
              },
              {
                value: `${t('shared.no', { ns: 'selfServiceForm' })}`,
                id: 'photoConsentNo',
                label: `${t('newSchoolApplication:steps.photoConsent.consentBox.no')}!`,
              },
            ]}
          />
        </StyledWrapper>
      </Box>

      <VSpacer size="small" />
      <Box pt={40} px={[32, 40]} pb={16} mb={16} backgroundColor="SULD_25">
        <Text.SubHeading small startSeen m={0} fontSize={20} color="SULD_200">
          {t('newSchoolApplication:steps.photoConsent.publicationBox.title')}
        </Text.SubHeading>
        <Text.TextBlock startSeen m={0} fontSize={16}>
          {t('newSchoolApplication:steps.photoConsent.publicationBox.description')}
        </Text.TextBlock>

        <StyledWrapper>
          <FieldRadioGroup
            id="publicationConsent"
            options={[
              {
                value: `${t('shared.yes', { ns: 'selfServiceForm' })}`,
                id: 'publicationConsentYes',
                label: `${t(
                  'newSchoolApplication:steps.photoConsent.publicationBox.yes'
                )}!`,
              },
              {
                value: `${t('shared.no', { ns: 'selfServiceForm' })}`,
                id: 'publicationConsentNo',
                label: `${t(
                  'newSchoolApplication:steps.photoConsent.publicationBox.no'
                )}!`,
              },
            ]}
          />{' '}
        </StyledWrapper>
      </Box>
    </>
  );
};
