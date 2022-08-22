import React from 'react';
import { useTranslation } from 'next-i18next';
import { InferType } from 'yup';
import Image from 'next/image';

import { WizardScreenRenderProps } from 'components/SelfService/types/types';
import { useSelfServiceStore } from 'components/SelfService/SelfServiceContext/selfServiceProvider';
import {
  NewSchoolApplicationExternalData,
  NewSchoolApplicationStepsEnum,
  NewSchoolApplicationForm,
} from 'views/SelfServiceView/newSchoolApplication/types/newSchoolApplicationTypes';
import { relativeStudentConnectionOptions } from 'views/SelfServiceView/shared/utils/constants';
import { CmsContent } from 'components/CmsContent/CmsContent';

import Alert from '@reykjavik/hanna-react/Alert';
import Attention from '@reykjavik/hanna-react/Attention';
import { Box } from 'components/Box/box';
import { Text } from 'components/Text/text';
import { GridRow } from 'components/Grid/gridRow';
import { GridColumn } from 'components/Grid/gridColumn';
import {
  FormDataBox,
  FormDataBoxWrapper,
} from 'views/SelfServiceView/shared/components/formDataBox';
import VSpacer from '@reykjavik/hanna-react/VSpacer';
import { formatDate, formatPhone } from 'utils/formatters';
import Checkbox from '@reykjavik/hanna-react/Checkbox';

import { FormData } from 'views/SelfServiceView/shared/components/formData';
import {
  languageList,
  topLanguageList,
} from 'views/SelfServiceView/schoolEnrollment/screens/Languages/languageList';
import { formatNationalId } from 'views/SelfServiceView/shared/utils/helpers';

import { FormDataHeading } from 'views/SelfServiceView/shared/components/formDataHeading';
import { relativeSchema } from 'views/SelfServiceView/shared/screens/Relatives/schema';
import { guardianSchema } from 'views/SelfServiceView/shared/screens/ChildrenAndGuardians/schema';
import { getRequestedSchool } from 'views/SelfServiceView/newSchoolApplication/screens/School/helpers';
import { getNextYearSchoolSeasonBegin } from 'utils/helpers';
import {
  StyledFormDataBoxWrapper,
  StyledGridColumn,
  StyledImageWrapper,
} from './overview.styles';

type Props = WizardScreenRenderProps & {
  externalData?: NewSchoolApplicationExternalData;
};

export const OverviewScreen = (props: Props) => {
  const { t, i18n } = useTranslation(['newSchoolApplication', 'selfServiceForm']);
  const externalData = props.externalData as NewSchoolApplicationExternalData;
  const { cmsData } = externalData;
  const [{ answers }] = useSelfServiceStore();
  const nsaAnswers = answers as NewSchoolApplicationForm;

  const school = getRequestedSchool(
    nsaAnswers.school.requestedSchool.school,
    cmsData.schoolsList
  );

  const nextSchoolSeason = getNextYearSchoolSeasonBegin();
  const schoolBeginDate =
    nsaAnswers.school.currentSchoolSeasonBeginDate === undefined
      ? nextSchoolSeason
      : nsaAnswers.school.currentSchoolSeasonBeginDate;

  const allLanguages = [...topLanguageList, ...languageList];
  const nativeLanguages = nsaAnswers['different-needs'].languages.map(
    (lang) => allLanguages.find((x) => x.value === lang)?.label
  );

  return school === null ? (
    <>
      <Text.Heading size="small" Tag="h2" mt={0}>
        {cmsData.overview.contentTitle}
      </Text.Heading>
      <Box mb={40}>
        <Attention small>{t('steps.shared.attentionTextBug')}</Attention>
      </Box>
    </>
  ) : (
    <>
      <Box>
        <Text.Heading size="small" Tag="h2" mt={0}>
          {cmsData.overview.contentTitle}
        </Text.Heading>
        <CmsContent
          content={
            cmsData.overview.content.length > 0
              ? cmsData.overview.content[0].content
              : undefined
          }
        />
      </Box>

      <VSpacer size="small" />
      <FormDataBox
        title={t('steps.childrenAndGuardians.children', {
          ns: 'selfServiceForm',
        })}
        stepId={NewSchoolApplicationStepsEnum.ChildrenAndGuardians}
        rows={[
          {
            columns: [
              {
                label: t('shared.name', { ns: 'selfServiceForm' }),
                value: nsaAnswers['children-and-guardians'].child.name,
                width: ['12/12', '2/3'],
                mb: [8, 0],
              },
              {
                label: t('shared.nationalId', { ns: 'selfServiceForm' }),
                value: formatNationalId(
                  nsaAnswers['children-and-guardians'].child.nationalId
                ),
                width: ['12/12', '1/3'],
                mb: [8, 0],
              },
            ],
          },
        ]}
      />

      <FormDataHeading
        title={t('steps.childrenAndGuardians.guardians', {
          ns: 'selfServiceForm',
        })}
        stepId={NewSchoolApplicationStepsEnum.ChildrenAndGuardians}
      />
      {nsaAnswers['children-and-guardians'].guardians?.map(
        (guardian: InferType<typeof guardianSchema>) => (
          <FormDataBox
            key={guardian.name}
            rows={[
              {
                columns: [
                  {
                    label: t('selfServiceForm:shared.name'),
                    value: guardian.name,
                    width: ['12/12', '1/2'],
                    mb: [8, 0],
                  },
                  {
                    label: t('selfServiceForm:shared.nationalId'),
                    value: formatNationalId(guardian.nationalId),
                    width: ['12/12', '1/2'],
                    mb: [8, 0],
                  },
                ],
              },
              {
                columns: [
                  {
                    label: t('selfServiceForm:shared.address'),
                    value: guardian.address,
                    width: ['12/12', '1/2'],
                    mb: [8, 0],
                  },
                  {
                    label: t('shared.postalCode', { ns: 'selfServiceForm' }),
                    value: guardian.postalCode ?? '',
                    width: ['12/12', '1/2'],
                    mb: [8, 0],
                  },
                ],
              },
              {
                columns: [
                  {
                    label: t('shared.tel', { ns: 'selfServiceForm' }),
                    value: formatPhone(guardian.tel ?? ''),
                    width: ['12/12', '1/2'],
                    mb: [8, 0],
                  },
                  {
                    label: t('shared.email', { ns: 'selfServiceForm' }),
                    value: guardian.email ?? '',
                    width: ['12/12', '1/2'],
                    mb: [8, 0],
                  },
                ],
              },
            ]}
          />
        )
      )}

      <StyledFormDataBoxWrapper>
        <FormDataBoxWrapper
          title={t('status.overview.school')}
          stepId={NewSchoolApplicationStepsEnum.School}
        >
          <GridRow>
            <GridColumn width={['8/12']}>
              <Text.TextBlock mt={0} startSeen fontWeight="bold">
                {school.name}
              </Text.TextBlock>
              <Box mb={24}>
                <FormData
                  label={t('status.overview.classList')}
                  value={t('steps.selectedSchool.classList', {
                    classes: school.classes,
                  })}
                />
              </Box>
              <Box mb={24}>
                <FormData
                  label={t('status.overview.currentSchoolSeasonBeginDate')}
                  value={formatDate(schoolBeginDate)}
                />
              </Box>
              <Box>
                <FormData
                  label={t('status.overview.schoolReason')}
                  value={nsaAnswers.school.reasonForSchoolChange}
                />
              </Box>
            </GridColumn>
            <StyledGridColumn width={['4/12']}>
              <StyledImageWrapper>
                <Image
                  src={school.image.url}
                  layout="fill"
                  objectFit="cover"
                  alt="Temp school image"
                />
              </StyledImageWrapper>
            </StyledGridColumn>
          </GridRow>
        </FormDataBoxWrapper>
      </StyledFormDataBoxWrapper>

      {nsaAnswers.relatives.relatives.length !== 0 ? (
        nsaAnswers.relatives.relatives.map(
          (relative: InferType<typeof relativeSchema>, index: number) => (
            <FormDataBox
              title={index === 0 ? t('status.overview.relatives') : undefined}
              stepId={index === 0 ? NewSchoolApplicationStepsEnum.Relatives : undefined}
              key={`relative-${relative.name}-${relative.tel}`}
              rows={[
                {
                  columns: [
                    {
                      label: t('selfServiceForm:shared.name', {
                        ns: 'selfServiceForm',
                      }),
                      value: relative.name,
                      width: ['12/12', '1/2'],
                      mb: [8, 0],
                    },
                    {
                      label: t('shared.tel', { ns: 'selfServiceForm' }),
                      value: formatPhone(relative.tel),
                      width: ['12/12', '1/2'],
                      mb: [8, 0],
                    },
                  ],
                },
                {
                  columns: [
                    {
                      label: t('shared.nationalId', { ns: 'selfServiceForm' }),
                      value: formatNationalId(relative.ssn),
                      width: ['12/12', '1/2'],
                      mb: [8, 0],
                    },
                    {
                      label: t('steps.relatives.connection', { ns: 'selfServiceForm' }),
                      value:
                        relativeStudentConnectionOptions[i18n.language].find(
                          (x) => x.value === relative.connection
                        )?.label ?? 'Tengsl fundust ekki',
                      width: ['12/12', '1/2'],
                      mb: [8, 0],
                    },
                  ],
                },
              ]}
            />
          )
        )
      ) : (
        <>
          <FormDataHeading
            title={t('status.overview.relatives')}
            stepId={NewSchoolApplicationStepsEnum.Relatives}
          />

          <Box mb={44}>
            {nsaAnswers.relatives.relatives.length === 0 && (
              <Alert type="warning">
                {t('steps.relatives.alert', { ns: 'selfServiceForm' })}
              </Alert>
            )}
          </Box>
        </>
      )}

      <FormDataBoxWrapper
        title={t('status.overview.photoConsentTitle')}
        stepId={NewSchoolApplicationStepsEnum.PhotoConsent}
      >
        <Box>
          <Box mb={24}>
            <FormData
              label={t('status.overview.photoConsent')}
              value={nsaAnswers['photo-consent'].photoConsent}
            />
          </Box>
          <Box>
            <FormData
              label={t('status.overview.publicationConsent')}
              value={nsaAnswers['photo-consent'].publicationConsent}
            />
          </Box>
        </Box>
      </FormDataBoxWrapper>

      <FormDataBoxWrapper
        title={t('status.overview.meals')}
        stepId={NewSchoolApplicationStepsEnum.SchoolMeals}
      >
        <Box>
          <GridRow>
            <GridColumn width={['12/12', '2/3']}>
              <Box mb={24}>
                <FormData
                  label={t('status.overview.foodAllergies')}
                  value={
                    nsaAnswers['school-meals'].foodAllergies?.join(', ') ??
                    t('status.overview.nothing')
                  }
                />
              </Box>
              <Box>
                <FormData
                  label={t('status.overview.foodIntolerances')}
                  value={
                    nsaAnswers['school-meals'].foodIntolerances?.join(', ') ??
                    t('status.overview.nothing')
                  }
                />
              </Box>
            </GridColumn>
            <GridColumn width={['12/12', '1/3']}>
              {nsaAnswers['school-meals'].isUsingEpiPen && (
                <Checkbox
                  label={t('steps.schoolMeals.usesEpiPen', { ns: 'selfServiceForm' })}
                  checked={nsaAnswers['school-meals'].isUsingEpiPen}
                  disabled
                />
              )}
            </GridColumn>
          </GridRow>
        </Box>
      </FormDataBoxWrapper>

      <FormDataBoxWrapper
        title={t('status.overview.differentNeeds')}
        stepId={NewSchoolApplicationStepsEnum.DifferentNeeds}
      >
        <Box pb={16}>
          <FormData
            label={t('status.overview.language')}
            value={nativeLanguages.join(', ') ?? ''}
          />
        </Box>
        {nsaAnswers['different-needs'].isRequestingDiscussionWithTeacher ? (
          <Box mb="-1.5rem">
            <Checkbox
              label={t('steps.differentNeeds.requestDiscussionWithTeacher')}
              checked
              disabled
            />
          </Box>
        ) : (
          <Text.TextBlock m={0} startSeen>
            {t('status.overview.noDiscussionWithTeacher')}
          </Text.TextBlock>
        )}
      </FormDataBoxWrapper>
    </>
  );
};
