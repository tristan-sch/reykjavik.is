import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { formatSchoolName } from 'views/SchoolEnrollmentStatusView/helpers/helpers';
import { WizardScreenRenderProps } from 'components/SelfService/types/types';
import { useSelfServiceStore } from 'components/SelfService/SelfServiceContext/selfServiceProvider';
import {
  NewSchoolApplicationExternalData,
  NewSchoolApplicationForm,
} from 'views/SelfServiceView/newSchoolApplication/types/newSchoolApplicationTypes';
import { getRequestedSchool } from 'views/SelfServiceView/newSchoolApplication/screens/School/helpers';
// Languages are integrated in the differentNeeds screen in newschool-app so it's not possible to have it shared, but the languageList has to be the same
import {
  languageList,
  topLanguageList,
} from 'views/SelfServiceView/schoolEnrollment/screens/Languages/languageList';
import { Text } from 'components/Text/text';
import { CmsContent } from 'components/CmsContent/CmsContent';
import VSpacer from '@reykjavik/hanna-react/VSpacer';
import { Box } from 'components/Box/box';
import { FieldCheckbox } from 'components/SelfService/Fields/CheckBoxes/FieldCheckbox/FieldCheckbox';
import { Info as InfoIcon } from 'components/SelfService/lib/icons/Info/info';
import Attention from '@reykjavik/hanna-react/Attention';
import { FieldMultiSelect } from 'components/SelfService/Fields/FieldMultiSelect/FieldMultiSelect';
import {
  StyledFieldMultiSelectWrapper,
  StyledFieldCheckboxWrapper,
} from './differentNeeds.styles';

type Props = WizardScreenRenderProps & {
  externalData?: NewSchoolApplicationExternalData;
};

export const DifferentNeedsScreen = (props: Props) => {
  const { t, i18n } = useTranslation(['newSchoolApplication']);
  const {
    methods: { watch },
  } = props;
  const externalData = props.externalData as NewSchoolApplicationExternalData;
  const { cmsData } = externalData;
  const isRequestingDiscussionWithTeacher = watch('isRequestingDiscussionWithTeacher');
  const [{ answers }] = useSelfServiceStore();
  const nsaAnswers = answers as NewSchoolApplicationForm;
  const school = getRequestedSchool(
    nsaAnswers.school.requestedSchool.school,
    cmsData.schoolsList
  );

  const formattedSchoolName =
    school === null ? 'School' : formatSchoolName(school.name, i18n.language);

  return school === null ? (
    <>
      <Text.Heading size="small" Tag="h2" mt={0}>
        {cmsData.differentNeeds.contentTitle}
      </Text.Heading>
      <Box mb={40}>
        <Attention small>{t('steps.shared.attentionTextBug')}</Attention>
      </Box>
    </>
  ) : (
    <>
      <Text.Heading size="small" Tag="h2" mt={0}>
        {cmsData.differentNeeds.contentTitle}
      </Text.Heading>

      <VSpacer size="small" />
      <CmsContent
        content={
          cmsData.differentNeeds.content.length > 0
            ? cmsData.differentNeeds.content[0].content
            : undefined
        }
      />
      <Box backgroundColor="SULD_50" pt={40} px={[32, 40]} pb={16}>
        <Attention>{t('steps.differentNeeds.attentionBox')}</Attention>
        <StyledFieldMultiSelectWrapper>
          <FieldMultiSelect
            id="languages"
            label=""
            placeholder={t('steps.differentNeeds.languageSelectPlaceholder')}
            topOptions={topLanguageList}
            options={languageList}
            selectWidth={['100%', '75%']}
          />
        </StyledFieldMultiSelectWrapper>
        <StyledFieldCheckboxWrapper>
          <FieldCheckbox
            id="notIcelandicSpokenEnvironment"
            options={[
              {
                id: 'notIcelandicSpokenEnvironment',
                label: t('steps.differentNeeds.notIcelandicSpokenEnvironmentCheckbox'),
                value: true,
              },
            ]}
          />
        </StyledFieldCheckboxWrapper>
      </Box>

      <VSpacer size="small" />
      <CmsContent
        content={
          cmsData.differentNeeds.content.length >= 1
            ? cmsData.differentNeeds.content[1].content
            : undefined
        }
      />
      <Box pt={40} px={[32, 40]} pb={16} mb={20} backgroundColor="SULD_25">
        <StyledFieldCheckboxWrapper>
          <FieldCheckbox
            id="isRequestingDiscussionWithTeacher"
            options={[
              {
                id: 'requestDiscussionWithTeacher',
                label: `${t(
                  'steps.differentNeeds.requestDiscussionWithTeacher'
                )} [${formattedSchoolName}]`,
                value: true,
              },
            ]}
          />
        </StyledFieldCheckboxWrapper>
        {isRequestingDiscussionWithTeacher && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Text.TextBlock fontSize={12} lineHeight={16} pb={16} mb={0} startSeen>
              {t('steps.differentNeeds.requestDiscussionWithTeacherDescription')}
            </Text.TextBlock>
          </motion.div>
        )}
      </Box>

      <CmsContent
        content={
          cmsData.differentNeeds.content.length >= 2
            ? cmsData.differentNeeds.content[2].content
            : undefined
        }
      />
      <Box p="18px 16px 10px 16px" mb={32} backgroundColor="FAXAFLOI_50" borderRadius={8}>
        <Text.TextBlock small startSeen mb={0}>
          <Box display="inline-block" position="relative" top={3} mr={10}>
            <InfoIcon />
          </Box>
          {t('steps.differentNeeds.infoText')}
        </Text.TextBlock>
      </Box>

      <Text.TextBlock fontWeight="bold" small startSeen>
        {t('steps.differentNeeds.otherInformation')}
      </Text.TextBlock>
    </>
  );
};
