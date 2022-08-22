import * as yup from 'yup';

import { NewSchoolApplicationWizardContent } from 'types/cmsPage';
import { UserDetails } from 'types/user';
import { RelativeConnectionEnum, School } from 'views/SelfServiceView/shared/types';
import { schoolSchema } from 'views/SelfServiceView/newSchoolApplication/screens/School/schema';
import { childrenAndGuardiansSchema } from 'views/SelfServiceView/shared/screens/ChildrenAndGuardians/schema';
import { relativesSchema } from 'views/SelfServiceView/shared/screens/Relatives/schema';
import { photoConsentSchema } from 'views/SelfServiceView/newSchoolApplication/screens/PhotoConsent/schema';
import { differentNeedsSchema } from 'views/SelfServiceView/newSchoolApplication/screens/DifferentNeeds/schema';
import { schoolMealsSchema } from '../../shared/screens/SchoolMeals/schema';

export interface NewSchoolApplicationRelative {
  id: string;
  name: string;
  tel: string;
  ssn: string;
  connection: RelativeConnectionEnum;
}

export interface NewSchoolApplicationGuardian {
  id?: string;
  name: string;
  email?: string;
  tel?: string;
  nationalId: string;
  address: string;
  postalCode: string;
}

export interface NewSchoolApplicationExternalData {
  user?: UserDetails;
  cmsData: NewSchoolApplicationWizardContent;
  schools: School[];
}

export enum NewSchoolApplicationStepsEnum {
  Intro = 'intro',
  ChildrenAndGuardians = 'children-and-guardians',
  School = 'school',
  SelectedSchool = 'choosed-school',
  Relatives = 'relatives',
  PhotoConsent = 'photo-consent',
  SchoolMeals = 'school-meals',
  DifferentNeeds = 'different-needs', // Languages are in DifferentNeeds
  OverviewAndConfirmation = 'overview-and-confirmation',
}

export type NewSchoolApplicationForm = {
  'children-and-guardians': yup.InferType<typeof childrenAndGuardiansSchema>;
  school: yup.InferType<typeof schoolSchema>;
  relatives: yup.InferType<typeof relativesSchema>;
  'school-meals': yup.InferType<typeof schoolMealsSchema>;
  'photo-consent': yup.InferType<typeof photoConsentSchema>;
  'different-needs': yup.InferType<typeof differentNeedsSchema>;
};

export type NewSchoolApplicationActiveLanguage = 'is' | 'en' | 'pl';

export type NewSchoolApplicationStatus =
  | 'approved'
  | 'received'
  | 'optOut'
  | 'confirmed'
  | 'denied';

export interface NewSchoolApplicationChild {
  name: string;
  nationalId: string;
  schoolApplication: NewSchoolApplicationChild;
}

export interface NewSchoolApplication {
  timestamp: string;
  id: string;
  status: NewSchoolApplicationStatus;
  answers: string; // Stringified NewSchoolApplicationAnswers
  comments: string;
  grouping: string;
  lastUpdated: string;
}

export interface NewSchoolApplicationAnswers {
  'child-and-guardians': {
    child: { nationalId: string; name: string };
    guardians: Array<{
      name: string;
      nationalId: string;
      address: string;
      postalCode: string;
      tel: string;
      email: string;
    }>;
  };
  'different-needs': {
    languages: Array<string>;
    isRequestingDiscussionWithTeacher: boolean;
  };
  'photo-consent': {
    photoConsent: string;
    publicationConsent: string;
  };
  relatives: { relatives: NewSchoolApplicationRelative[] } | null;
  school: {
    currentIcelandicSchool?: {
      district: string;
      school: string;
    };
    currentSchoolLocation: string;
    currentSchoolSeasonBeginDate?: Date;
    reasonForSchoolChange: string;
    requestedSchool: {
      district: string;
      school: string;
    };
    selectedSchoolYear: string;
  };
  'school-meals': {
    foodAllergies: Array<string>;
    foodIntolerances: Array<string>;
    hasFoodAllergies: boolean;
    hasFoodIntolerances: boolean;
    isRequestingSchoolMealsSubscription: boolean;
    isUsingEpiPen: boolean;
  };
}

export interface SubmitNewSchoolApplicationFormResponse {
  applicationId: string;
}

export interface GetSchoolsResponse {
  schools: School[];
}

export interface SchoolApplicationDetails {
  children: NewSchoolApplicationChild[];
}
export interface GetSchoolApplicationsResponse {
  schoolApplication: SchoolApplicationDetails;
}
