import React from 'react';
import Image from 'next/image';
import { Text } from 'components/Text/text';
import { Trans, useTranslation } from 'next-i18next';
import { NewSchoolApplicationExternalData } from 'views/SelfServiceView/newSchoolApplication/types/newSchoolApplicationTypes';
import { Box } from 'components/Box/box';
import { Info as InfoIcon } from 'components/SelfService/lib/icons/Info/info';
import { WizardScreenRenderProps } from 'components/SelfService/types/types';

import { displayFirstName } from 'utils/formatters';
import { SELF_SERVICE_ROUTE, SCHOOL_ENROLLMENT_ROUTE } from 'utils/routes';

type Props = WizardScreenRenderProps & {
  externalData?: NewSchoolApplicationExternalData;
};

export const IntroductionLockedScreen = (props: Props) => {
  const { t } = useTranslation();
  const externalData = props.externalData as NewSchoolApplicationExternalData;
  const { user } = externalData;
  const name = displayFirstName(user ? user.name : '');
  return (
    <>
      <Box display={['none', 'none', 'flex']} mb={20}>
        <Image
          alt="Hverfaskoli"
          src="/images/school-enrollment/fjola-vetrarfri.png"
          width={650}
          height={427}
        />
      </Box>

      <Text.Heading size="small" Tag="h2" mt={0}>
        {`${t('selfServiceForm:steps.introduction.hello')}, ${name}`}
      </Text.Heading>

      <Text.TextBlock small startSeen>
        <Trans
          t={t}
          i18nKey="newSchoolApplication:steps.introduction.locked.description"
          values={{
            link: t('newSchoolApplication:steps.introduction.locked.descriptionLink'),
          }}
          components={{
            anchor: <a href={`/${SELF_SERVICE_ROUTE}/${SCHOOL_ENROLLMENT_ROUTE}`}> </a>,
          }}
        />
      </Text.TextBlock>

      <Box p="18px 16px 10px 16px" mt={64} backgroundColor="SULD_25" borderRadius={8}>
        <Text.TextBlock small startSeen mb={0}>
          <Box display="inline-block" position="relative" top={3} mr={10}>
            <InfoIcon />
          </Box>
          {t('newSchoolApplication:steps.introduction.locked.notice')}
        </Text.TextBlock>
      </Box>
    </>
  );
};
