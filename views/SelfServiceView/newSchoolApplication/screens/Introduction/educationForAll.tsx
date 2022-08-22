import React from 'react';
import { Text } from 'components/Text/text';
import { useTranslation } from 'next-i18next';

import { Box } from 'components/Box/box';
import ButtonTertiary from '@reykjavik/hanna-react/ButtonTertiary';

export const EducationForAll = () => {
  const { t } = useTranslation();
  return (
    <>
      <Box mt={40}>
        <Box p={40} mt={64} backgroundColor="SULD_25">
          <Box
            display={['block', 'flex']}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box maxWidth="65%">
              <Text.TextBlock mt={0} mb={[16, 0]} startSeen small>
                <strong>
                  {t('newSchoolApplication:steps.introduction.eductionForAllTitle')}
                </strong>
              </Text.TextBlock>
            </Box>
            <ButtonTertiary>
              <a
                target="__blank"
                href={t('newSchoolApplication:steps.introduction.eductionForAllUrl')}
              >
                {t(
                  'newSchoolApplication:steps.introduction.eductionForAllDescriptionLink'
                )}
              </a>
            </ButtonTertiary>
          </Box>
          <Text.TextBlock mt={16} mb={0} small startSeen>
            {t('newSchoolApplication:steps.introduction.eductionForAllDescription')}
          </Text.TextBlock>
        </Box>
      </Box>
    </>
  );
};
