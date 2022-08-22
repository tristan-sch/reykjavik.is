import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import isNil from 'lodash/isNil';
import Alert from '@reykjavik/hanna-react/Alert';

import { featureFlags } from 'utils/featureFlags';
import { Loading } from 'components/Loading/loading';
import { getUserDetails } from 'services/fristundService';
import { getNewSchoolApplicationCmsData } from 'services/newSchoolApplicationService';
import { UserDetails } from 'types/user';
import { NewSchoolApplicationWizardContent } from 'types/cmsPage';
import { LoginView } from 'views/LoginView/LoginView';
import { isEmptyValue } from 'utils/helpers';
import { Logger } from 'utils/Logger';
import { NewSchoolApplication } from 'views/SelfServiceView/newSchoolApplication/newSchoolApplication';
import { School } from 'views/SelfServiceView/shared/types';
import { getSchools } from 'services/selfServiceApplicationService';

interface NewSchoolAppPageProps {
  user?: UserDetails;
  cmsData: NewSchoolApplicationWizardContent;
  schools: School[];
  errorMessage: string;
}

const NewSchoolApplicationPage: NextPage<NewSchoolAppPageProps> = ({
  user,
  cmsData,
  schools,
  errorMessage,
}) => {
  const [session] = useSession();

  if (!session) {
    // Not signed in
    return <LoginView />;
  }

  if (isNil(user)) {
    return <Loading />;
  }

  if (!isEmptyValue(errorMessage)) {
    Logger('error', errorMessage);
    return (
      <div>
        <Alert type="error">{errorMessage}</Alert>
      </div>
    );
  }

  return <NewSchoolApplication externalData={{ user, cmsData, schools }} />;
};

export default NewSchoolApplicationPage;

export const getServerSideProps: GetServerSideProps<NewSchoolAppPageProps> = async (
  context
) => {
  const isFeatureAvailable = featureFlags.selfService['newschool-application'];
  if (!isFeatureAvailable) {
    return { notFound: true };
  }
  const locale = context.locale || 'is';
  let errorMessage = '';

  const sessionTask = getSession(context);

  const [translations, cmsData, session, schools, userDetails] = await Promise.all([
    serverSideTranslations(locale, []),
    getNewSchoolApplicationCmsData(locale),
    sessionTask,
    sessionTask.then((session) => (session ? getSchools(session) : [])),
    sessionTask
      .then((session) => session && getUserDetails(session))
      .then((userDetails) => {
        if (!userDetails) {
          // TODO: Create generic error messages and translate them.
          errorMessage =
            'An error occured while loading user details. Please try to log out and in again.';
          return {};
        }
        return { user: userDetails };
      }),
  ]);

  return {
    props: {
      ...translations,
      session,
      ...userDetails,
      cmsData,
      errorMessage,
      schools,
    },
  };
};
