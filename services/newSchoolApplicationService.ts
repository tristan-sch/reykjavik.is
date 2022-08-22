import { Client } from 'prismic.client';
import { Session } from 'next-auth';
import { NewSchoolApplicationWizardContent } from 'types/cmsPage';
import { StepSlice, School } from 'types/cmsContracts';
import {
  PRISMIC_NEWSCHOOL_APPLICATION_APP_WIZARD_UID,
  PRISMIC_SCHOOL_ENROLLMENT_APP_SCHOOLS_UID,
  PRISMIC_GDPR_UID,
} from 'utils/constants';
import { mapCmsStepSliceToNewSchoolApplicationWizardContent } from 'utils/mappers';
import { Logger } from 'utils/Logger';
import { authCall } from 'services/authCall';
import { API } from 'types/commonTypes';
import { isEmptyValue } from 'utils/helpers';
import {
  GetSchoolApplicationsResponse,
  NewSchoolApplicationActiveLanguage,
  NewSchoolApplicationAnswers,
  NewSchoolApplicationChild,
  NewSchoolApplicationForm,
  SubmitNewSchoolApplicationFormResponse,
} from 'views/SelfServiceView/newSchoolApplication/types/newSchoolApplicationTypes';
import { RichTextBlock } from 'prismic-reactjs';

export const getNewSchoolApplicationCmsData = async (
  language: string | undefined
): Promise<NewSchoolApplicationWizardContent> => {
  const cmsWizardResponse = await Client().getByUID(
    'wizard',
    PRISMIC_NEWSCHOOL_APPLICATION_APP_WIZARD_UID,
    {
      lang: language ?? 'is',
    }
  );
  const cmsSchoolsResponse = await Client().getByUID(
    'schools',
    PRISMIC_SCHOOL_ENROLLMENT_APP_SCHOOLS_UID,
    {
      lang: language ?? 'is',
    }
  );
  const cmsGdprResponse = await Client().getByUID('simple_content', PRISMIC_GDPR_UID, {
    lang: language ?? 'is',
  });
  const cmsWizardData = cmsWizardResponse.data.body as StepSlice[];
  const cmsSchoolsData = cmsSchoolsResponse.data.schools as School[];
  const cmsGdprData = cmsGdprResponse.data.content as RichTextBlock[];
  const schoolApplicationCmsContent = mapCmsStepSliceToNewSchoolApplicationWizardContent(
    cmsWizardData,
    cmsSchoolsData,
    cmsGdprData
  );
  return schoolApplicationCmsContent;
};
type NewSchoolApplicationDto = NewSchoolApplicationAnswers & {
  languages: {
    languages: string[];
    languageOfApplication: NewSchoolApplicationActiveLanguage;
  };
};
const newSchoolApplicationFormToNewSchoolApplicationDto = (
  data: NewSchoolApplicationForm,
  activeLanguage: NewSchoolApplicationActiveLanguage
): NewSchoolApplicationDto => {
  const dto: NewSchoolApplicationDto = {
    'child-and-guardians': {
      ...data['children-and-guardians'],
    },
    'different-needs': {
      ...data['different-needs'],
      languages:
        data['different-needs'].languages && data['different-needs'].languages.length > 0
          ? (data['different-needs'].languages as string[])
          : ['is'],
    },
    'photo-consent': {
      ...data['photo-consent'],
    },
    'school-meals': {
      ...data['school-meals'],
    },
    languages: {
      languages: ['is', 'en'],
      languageOfApplication: activeLanguage,
    },
    school: {
      ...data.school,
      currentIcelandicSchool: data.school.currentIcelandicSchool
        ? {
            district: data.school.currentIcelandicSchool.district,
            school: data.school.currentIcelandicSchool.school,
          }
        : undefined,
      currentSchoolSeasonBeginDate: data.school.currentIcelandicSchool
        .currentSchoolSeasonBeginDate
        ? data.school.currentIcelandicSchool.currentSchoolSeasonBeginDate
        : undefined,
    },
    relatives: !isEmptyValue(data.relatives.relatives) ? { ...data.relatives } : null,
  };
  return dto;
};
export const submitNewSchoolApplicationForm = async (
  data: NewSchoolApplicationForm,
  activeLanguage: NewSchoolApplicationActiveLanguage
): Promise<string | undefined> => {
  const payload = newSchoolApplicationFormToNewSchoolApplicationDto(data, activeLanguage);
  try {
    const response = await authCall<SubmitNewSchoolApplicationFormResponse>({
      method: 'post',
      api: API.MY_PAGES,
      path: '/schoolTransferApplication',
      data: {
        schoolTransfer: payload,
      },
    });
    return response?.data?.applicationId;
  } catch (error) {
    Logger('error', 'Failed to submit school enrollment form', error);
    return Promise.reject(error);
  }
};
// Fetches school applications for all children of the user
export const getSchoolApplications = async (
  session?: Session | null
): Promise<NewSchoolApplicationChild[] | null> => {
  try {
    const response = await authCall<GetSchoolApplicationsResponse>({
      method: 'get',
      api: API.MY_PAGES,
      path: '/schoolTransferApplication',
      session,
    });
    const children = response?.data?.schoolApplication?.children;
    if (!children) {
      Logger('error', 'getSchools: Empty schools response!', response);
    }
    return children || [];
  } catch (error) {
    Logger('error', 'failed to get school applications for user children', error);
    return Promise.reject(error);
  }
};
