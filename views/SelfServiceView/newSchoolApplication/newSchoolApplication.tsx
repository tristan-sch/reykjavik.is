import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import {
  NewSchoolApplicationExternalData,
  NewSchoolApplicationStepsEnum,
} from 'views/SelfServiceView/newSchoolApplication/types/newSchoolApplicationTypes';
import { FullscreenLayout } from 'components/FullscreenLayout/FullscreenLayout';
import { SelfServiceForm } from 'components/SelfService/SelfServiceForm/selfServiceForm';
import { useUserDetails } from 'hooks/useUserDetails';

import { Relatives } from 'views/SelfServiceView/shared/screens/Relatives/relatives';
import { relativesSchema } from 'views/SelfServiceView/shared/screens/Relatives/schema';
import { schoolSchema } from 'views/SelfServiceView/newSchoolApplication/screens/School/schema';
import { childrenAndGuardiansSchema } from 'views/SelfServiceView/shared/screens/ChildrenAndGuardians/schema';
import { ChildrenAndGuardians } from 'views/SelfServiceView/shared/screens/ChildrenAndGuardians/childrenAndGuardians';
import { IntroductionScreen } from './screens/Introduction/introduction';
import { IntroductionLockedScreen } from './screens/Introduction/introductionLocked';
import { EducationForAll } from './screens/Introduction/educationForAll';
import { SchoolScreen } from './screens/School/school';
import { SelectedSchool } from './screens/School/selectedSchool';
import { schoolMealsSchema } from '../shared/screens/SchoolMeals/schema';
import { SchoolMeals } from '../shared/screens/SchoolMeals/schoolMeals';
import { photoConsentSchema } from './screens/PhotoConsent/schema';
import { PhotoConsentScreen } from './screens/PhotoConsent/photoConsent';
import { differentNeedsSchema } from './screens/DifferentNeeds/schema';
import { DifferentNeedsScreen } from './screens/DifferentNeeds/differentNeeds';
import { OverviewScreen } from './screens/Overview/overview';

type Props = {
  externalData: NewSchoolApplicationExternalData;
};

export const NewSchoolApplication = ({
  externalData: { user, cmsData, schools },
}: Props) => {
  const { t } = useTranslation('newSchoolApplication');
  const [userDetails] = useUserDetails();
  const [childName, setChildName] = useState('');
  const router = useRouter();

  if (!userDetails) {
    return null;
  }

  // TODO: a GET will be added in the backend where we can find information about whether or not this application can be submitted for a child.
  // For now, if the child is not isEligibleForSchool, then he can submit a school transfer application

  const notEligibleChild = userDetails?.children?.find(
    (child) => child?.isEligibleForSchool === 'false'
  );
  const canSubmitNewSchoolApplication = notEligibleChild?.isEligibleForSchool === 'false';

  const getInitialFormState = () => {
    if (!user) {
      return 'initial-load';
    }
    if (canSubmitNewSchoolApplication) {
      return 'active';
    }
    return 'locked';
  };

  // TODO: Use WizardLayout from Hanna when that component has been updated.
  return (
    <FullscreenLayout
      title={t('wizard.title')}
      subTitle={childName}
      onClose={() => router.push('/services/born-og-unglingar')}
      multiLanguages
    >
      <SelfServiceForm
        state={getInitialFormState()}
        form={{
          title: 'Umsókn í nýjan grunnskóla',
          changeSubTitle: setChildName,
          externalData: {
            user,
            cmsData,
            schools,
          },
          sections: [
            {
              id: NewSchoolApplicationStepsEnum.Intro,
              label: cmsData.introduction.wizardTitle,
              isHiddenFromStepper: true,
              schema: null,
              buttonRowVariant: 'intro',
              renderScreen: canSubmitNewSchoolApplication
                ? IntroductionScreen
                : IntroductionLockedScreen,
              renderBottom: canSubmitNewSchoolApplication ? EducationForAll : undefined,
            },
            {
              id: NewSchoolApplicationStepsEnum.ChildrenAndGuardians,
              label: cmsData.childrenAndGuardians.wizardTitle,
              schema: childrenAndGuardiansSchema,
              renderScreen: function renderChildrenAndGuardians(props) {
                return <ChildrenAndGuardians screen="newSchool-application" {...props} />;
              },
            },
            {
              id: NewSchoolApplicationStepsEnum.School,
              label: cmsData.school.wizardTitle,
              schema: schoolSchema,
              renderScreen: SchoolScreen,
            },
            {
              id: NewSchoolApplicationStepsEnum.SelectedSchool,
              label: cmsData.selectedSchool.wizardTitle,
              schema: null,
              renderScreen: SelectedSchool,
            },
            {
              id: NewSchoolApplicationStepsEnum.Relatives,
              label: cmsData.relatives.wizardTitle,
              schema: relativesSchema,
              renderScreen: function renderRelatives(props) {
                return <Relatives screen="newSchool-application" {...props} />;
              },
            },
            {
              id: NewSchoolApplicationStepsEnum.PhotoConsent,
              label: cmsData.photoConsent.wizardTitle,
              schema: photoConsentSchema,
              renderScreen: PhotoConsentScreen,
            },
            {
              id: NewSchoolApplicationStepsEnum.SchoolMeals,
              label: cmsData.schoolMeals.wizardTitle,
              schema: schoolMealsSchema,
              renderScreen: function schoolMeals(props) {
                return <SchoolMeals screen="newSchool-application" {...props} />;
              },
            },
            {
              id: NewSchoolApplicationStepsEnum.DifferentNeeds,
              label: cmsData.differentNeeds.wizardTitle,
              schema: differentNeedsSchema,
              renderScreen: DifferentNeedsScreen,
            },
            {
              id: NewSchoolApplicationStepsEnum.OverviewAndConfirmation,
              label: cmsData.overview.wizardTitle,
              schema: null,
              renderScreen: OverviewScreen,
            },
          ],
        }}
      />
    </FullscreenLayout>
  );
};
