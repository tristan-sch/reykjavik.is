import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import Attention from '@reykjavik/hanna-react/Attention';
import { Text } from 'components/Text/text';
import { Box } from 'components/Box/box';
import { GridRow } from 'components/Grid/gridRow';
import { GridColumn } from 'components/Grid/gridColumn';
import { WizardScreenRenderProps } from 'components/SelfService/types/types';
import { FieldText } from 'components/SelfService/Fields/FieldText/fieldText';
import { FieldSelectbox } from 'components/SelfService/Fields/FieldSelectbox/FieldSelectbox';
import { FieldRadioGroup } from 'components/SelfService/Fields/Radios/FieldRadioGroup/FieldRadioGroup';
import { FieldRadioButton } from 'components/SelfService/Fields/Radios/FieldRadioButton/FieldRadioButton';
import Datepicker from '@reykjavik/hanna-react/Datepicker';
import { dateFormatString } from 'utils/formatters';
import { NewSchoolApplicationExternalData } from 'views/SelfServiceView/newSchoolApplication/types/newSchoolApplicationTypes';
import { CmsContent } from 'components/CmsContent/CmsContent';
import {
  getAllDistricts,
  getSchoolsByDistrict,
} from 'views/SelfServiceView/shared/utils/helpers';
import { getSchoolSeason } from 'utils/helpers';
import VSpacer from '@reykjavik/hanna-react/VSpacer';
import icelandicSchools from './schools.json';
import regions from './regions.json';
import { FieldRadioWrapper } from './school.styles';

type Props = WizardScreenRenderProps & {
  externalData?: NewSchoolApplicationExternalData;
};

export const SchoolScreen = (props: Props) => {
  const { t } = useTranslation(['newSchoolApplication']);
  const externalData = props.externalData as NewSchoolApplicationExternalData;
  const { cmsData, schools, user } = externalData;
  const { methods } = props;

  const nextSchoolSeason = getSchoolSeason('next');
  const currentSchoolSeason = getSchoolSeason('current');

  getSchoolSeason('current');

  const requestedSchoolDistrict = methods.watch('requestedSchool.district') as
    | string
    | undefined;
  const userDistrict = user?.school?.neighbourhoodSchoolDistricts
    ? user.school.neighbourhoodSchoolDistricts[0]
    : undefined;
  const defaultDistrict = userDistrict ?? 'Árbær';
  const selectedDistrict = !requestedSchoolDistrict
    ? defaultDistrict
    : requestedSchoolDistrict;

  const selectedSchoolLocation = methods.watch('currentSchoolLocation') as
    | 'iceland'
    | 'abroad';

  const currentIcelandicSchoolDistrict = methods.watch(
    'currentIcelandicSchool.district'
  ) as string | undefined;

  const allDistricts = getAllDistricts(schools).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    if (selectedSchoolLocation && selectedSchoolLocation === 'abroad') {
      methods.setValue('currentIcelandicSchool', undefined, {
        shouldValidate: true,
      });
    }
  }, [selectedSchoolLocation]);

  const selectedSchoolYear = methods.watch('selectedSchoolYear') as
    | 'nextSchoolSeason'
    | 'currentSchoolSeason';

  const [startDate, setStartDate] = useState<Date>();

  return (
    <>
      <Text.Heading size="small" Tag="h2" mt={0}>
        {cmsData.school.contentTitle}
      </Text.Heading>

      <Text.SubHeading startSeen Tag="h3" my={0}>
        {cmsData.school.content.length > 0 && (
          <CmsContent content={cmsData.school.content[0].content} />
        )}
      </Text.SubHeading>

      <Box backgroundColor="SULD_50" pt={30} pb={10} px={40} my={40}>
        <FieldRadioGroup
          id="currentSchoolLocation"
          defaultValue="iceland"
          options={[
            {
              value: 'abroad',
              id: 'abroad',
              label: `${t(
                'newSchoolApplication:steps.school.currentSchoolLocation.abroadRadio'
              )}`,
            },
            {
              value: 'iceland',
              id: 'iceland',
              label: `${t(
                'newSchoolApplication:steps.school.currentSchoolLocation.icelandRadio'
              )}`,
            },
          ]}
        />

        {selectedSchoolLocation === 'iceland' && (
          <>
            <Text.Label fontSize={16} mb={15}>
              {t(
                'newSchoolApplication:steps.school.currentSchoolLocation.selectBoxDescription'
              )}
            </Text.Label>
            <GridRow>
              <GridColumn width={['12/12', '1/2']}>
                <FieldSelectbox
                  id="currentIcelandicSchool.district"
                  label={t(
                    'newSchoolApplication:steps.school.currentSchoolLocation.selectBoxDistrictLabel'
                  )}
                  defaultValue="SSH"
                  options={[
                    ...regions.map((region) => {
                      const item = {
                        label: region.name,
                        value: region.id,
                      };
                      return item;
                    }),
                  ]}
                />
              </GridColumn>
              <GridColumn width={['12/12', '1/2']}>
                <FieldSelectbox
                  id="currentIcelandicSchool.school"
                  label={t(
                    'newSchoolApplication:steps.school.currentSchoolLocation.selectBoxSchoolLabel'
                  )}
                  options={[
                    { label: '', value: '' },
                    ...icelandicSchools
                      .filter(
                        (s) => s.landshluti === (currentIcelandicSchoolDistrict ?? 'SSH')
                      )
                      .sort((a, b) => a.skoli.localeCompare(b.skoli))
                      .map((school) => {
                        const item = {
                          label: school.skoli,
                          value: school.skoli,
                        };
                        return item;
                      }),
                  ]}
                />
              </GridColumn>
            </GridRow>
          </>
        )}
      </Box>

      <Text.SubHeading startSeen Tag="h3" my={0}>
        {cmsData.school.content.length >= 1 && (
          <CmsContent content={cmsData.school.content[1].content} />
        )}
      </Text.SubHeading>

      <Box backgroundColor="SULD_50" py={40} px={20} my={40}>
        <Attention>
          <Trans
            t={t}
            values={{
              link: t(
                'newSchoolApplication:steps.school.newSchoolLocation.attentionLink'
              ),
            }}
            i18nKey="newSchoolApplication:steps.school.newSchoolLocation.attentionText"
            components={{
              anchor: (
                <a target="__blank" href="https://reykjavik.is/grunnskolar">
                  {' '}
                </a>
              ),
            }}
          />
        </Attention>

        <Box mb={20}>
          <Text.Label fontSize={16}>
            {t(
              'newSchoolApplication:steps.school.newSchoolLocation.selectBoxSchoolLabel'
            )}
          </Text.Label>
        </Box>

        <GridRow>
          <GridColumn width={['12/12', '1/2']}>
            <FieldSelectbox
              id="requestedSchool.district"
              label={t(
                'newSchoolApplication:steps.school.newSchoolLocation.selectBoxDistrictLabel'
              )}
              options={allDistricts}
              defaultValue={defaultDistrict}
            />
          </GridColumn>
          <GridColumn width={['12/12', '1/2']}>
            <FieldSelectbox
              id="requestedSchool.school"
              label={t(
                'newSchoolApplication:steps.school.newSchoolLocation.selectBoxSchoolLabel'
              )}
              options={[
                { label: '', value: '' },
                ...getSchoolsByDistrict(selectedDistrict, schools).map((school) => {
                  return {
                    label: school.name,
                    value: school.name,
                  };
                }),
              ]}
            />
          </GridColumn>
        </GridRow>
      </Box>

      <Text.SubHeading small startSeen Tag="h3" mt={0} mb={40}>
        {t('newSchoolApplication:steps.school.schoolYear.title')}
      </Text.SubHeading>

      <FieldRadioWrapper>
        <FieldRadioButton
          id="selectedSchoolYear"
          options={[
            {
              id: nextSchoolSeason,
              label: `${t('newSchoolApplication:steps.school.schoolYear.next')}`,
              value: nextSchoolSeason,
              infoText: nextSchoolSeason,
            },
            {
              id: currentSchoolSeason,
              label: `${t('newSchoolApplication:steps.school.schoolYear.current')}`,
              value: currentSchoolSeason,
              infoText: currentSchoolSeason,
            },
          ]}
        />
      </FieldRadioWrapper>
      {selectedSchoolYear === currentSchoolSeason && (
        <>
          <Datepicker
            id="currentSchoolSeasonBeginDate"
            value={startDate}
            label={t('newSchoolApplication:steps.school.schoolYear.datePickerLabel')}
            required
            minDate={startDate}
            localeCode="is"
            dateFormat={dateFormatString}
            onChange={(startDate) => setStartDate(startDate)}
          />
        </>
      )}

      <VSpacer size="small" />
      <Text.SubHeading small startSeen Tag="h3" mt={0} mb={40}>
        {t('newSchoolApplication:steps.school.explanation.title')}
      </Text.SubHeading>

      <Attention small>
        {t('newSchoolApplication:steps.school.explanation.description')}
      </Attention>

      <FieldText
        id="reasonForSchoolChange"
        type="textarea"
        label=""
        placeholder={t('newSchoolApplication:steps.school.explanation.placeholder')}
      />
    </>
  );
};
