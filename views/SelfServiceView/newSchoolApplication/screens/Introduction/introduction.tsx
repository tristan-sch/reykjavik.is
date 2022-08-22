import React, { useState } from 'react';
import Image from 'next/image';
import { Text } from 'components/Text/text';
import { useTranslation } from 'next-i18next';
import TextButton from '@reykjavik/hanna-react/TextButton';

import { NewSchoolApplicationExternalData } from 'views/SelfServiceView/newSchoolApplication/types/newSchoolApplicationTypes';
import { Box } from 'components/Box/box';
import { Info as InfoIcon } from 'components/SelfService/lib/icons/Info/info';
import { WizardScreenRenderProps } from 'components/SelfService/types/types';
import { CmsContent } from 'components/CmsContent/CmsContent';
import { BlingModal } from 'components/SelfService/BlingModal/blingModal';
import { displayFirstName } from 'utils/formatters';

type Props = WizardScreenRenderProps & {
  externalData?: NewSchoolApplicationExternalData;
};

export const IntroductionScreen = (props: Props) => {
  const { t } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const externalData = props.externalData as NewSchoolApplicationExternalData;
  const { user, cmsData } = externalData;
  const name = displayFirstName(user?.name);
  return (
    <>
      <Box display={['none', 'none', 'flex']} mb={20}>
        <Image
          alt="Hverfaskoli"
          src="/images/school-enrollment/fjola-umsokn.png"
          width={650}
          height={427}
        />
      </Box>

      <Text.Heading size="small" Tag="h2" mt={0}>
        {`${t('selfServiceForm:steps.introduction.hello')}, ${name}, ${t(
          'newSchoolApplication:steps.introduction.title'
        )}!`}
      </Text.Heading>

      <CmsContent
        content={
          cmsData.introduction.content.length > 0
            ? cmsData.introduction.content[0].content
            : undefined
        }
      />

      <Box p="18px 16px 10px 16px" mt={64} backgroundColor="SULD_25" borderRadius={8}>
        <Text.TextBlock small startSeen mb={0}>
          <Box display="inline-block" position="relative" top={3} mr={10}>
            <InfoIcon />
          </Box>
          <Box display="inline-block" mr={5}>
            <TextButton onClick={() => setModalIsOpen(true)}>
              {t('selfServiceForm:steps.introduction.privacyStatement.link')}
            </TextButton>
          </Box>
          {t('selfServiceForm:steps.introduction.privacyStatement.text')}
        </Text.TextBlock>
      </Box>

      {cmsData.introduction.content.length >= 1 && (
        <BlingModal open={modalIsOpen} onClosed={() => setModalIsOpen(false)}>
          <CmsContent wide content={cmsData.introduction.content[1].content} />
        </BlingModal>
      )}
    </>
  );
};
