import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { formatSchoolName } from 'views/SchoolEnrollmentStatusView/helpers/helpers';
import { Text } from 'components/Text/text';
import { Box } from 'components/Box/box';
import { TagPill } from 'components/TagPill/tagPill';
import Attention from '@reykjavik/hanna-react/Attention';
import { WizardScreenRenderProps } from 'components/SelfService/types/types';
import { useSelfServiceStore } from 'components/SelfService/SelfServiceContext/selfServiceProvider';
import {
  NewSchoolApplicationExternalData,
  NewSchoolApplicationForm,
} from 'views/SelfServiceView/newSchoolApplication/types/newSchoolApplicationTypes';
import { getRequestedSchool } from './helpers';

type Props = WizardScreenRenderProps & {
  externalData?: NewSchoolApplicationExternalData;
};

export const SelectedSchool = (props: Props) => {
  const { t, i18n } = useTranslation('newSchoolApplication');
  const externalData = props.externalData as NewSchoolApplicationExternalData;
  const { cmsData } = externalData;
  const [{ answers }] = useSelfServiceStore();

  const nsaAnswers = answers as NewSchoolApplicationForm;

  const school = getRequestedSchool(
    nsaAnswers.school.requestedSchool.school,
    cmsData.schoolsList
  );

  return school === null ? (
    <>
      <Text.Heading size="small" Tag="h2" mt={0}>
        {cmsData.selectedSchool.contentTitle}
      </Text.Heading>
      <Box mb={40}>
        <Attention small>{t('steps.selectedSchool.attentionTextBug')}</Attention>
      </Box>
    </>
  ) : (
    <>
      <Text.Heading size="small" Tag="h2" mt={0}>
        {cmsData.selectedSchool.contentTitle}
      </Text.Heading>

      <Box display={['block', 'flex']} justifyContent="space-between" mb={6}>
        <Text.TextBlock startSeen>
          <p>
            {t('steps.selectedSchool.introText', {
              schoolName: formatSchoolName(school.name, i18n.language),
            })}
          </p>
        </Text.TextBlock>
      </Box>
      <Image
        src={school.image.url}
        layout="responsive"
        width={school.image.width}
        height={school.image.height}
        alt="Temp school image"
      />
      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        alignItems="center"
        py={24}
        borderBottom="SULD_50"
      >
        <Box display="flex" alignItems="center">
          <Text.SubHeading startSeen m={0}>
            {school.name}
          </Text.SubHeading>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          textAlign={['left', 'right']}
          mt={[20, 0]}
        >
          <TagPill mb={[8, 0]} ml={8}>
            {t('steps.selectedSchool.classList', { classes: school.classes })}
          </TagPill>
        </Box>
      </Box>
      <Box my={24}>
        <Text.Label>{t('steps.selectedSchool.schoolInfo')}</Text.Label>
        <Text.TextBlock small startSeen mt={5} lineHeight={24}>
          {school.description}
        </Text.TextBlock>
      </Box>
      <Box mb={40}>
        <Attention small>{t('steps.selectedSchool.attentionText')}</Attention>
      </Box>
    </>
  );
};
