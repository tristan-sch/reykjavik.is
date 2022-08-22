import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Client } from 'prismic.client';

import { Loading } from 'components/Loading/loading';
import { Page } from 'components/Page/Page';
import { ServiceListData } from 'types/cmsPage';
import { PRISMIC_SERVICES_UID } from 'utils/constants';
import { mapCmsServicesListToServicesListData } from 'utils/mappers';
import { HomeView } from 'views/HomeView/HomeView';
import { LoginView } from 'views/LoginView/LoginView';

interface HomePageProps {
  services: ServiceListData;
}

const HomePage: NextPage<HomePageProps> = (props: HomePageProps) => {
  const [session, loading] = useSession();

  if (loading && !session) {
    return <Loading />;
  }

  if (!session) {
    // Not signed in
    return <LoginView />;
  }

  return (
    <Page>
      <HomeView services={props.services} />
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context) => {
  const [session, translations, cmsResult] = await Promise.all([
    getSession(context),
    serverSideTranslations(context.locale || '', []),

    Client()
      .getByUID('service', PRISMIC_SERVICES_UID, {
        lang: context.locale || 'is',
      })
      .then((cmsResponse) => {
        const services = mapCmsServicesListToServicesListData(
          cmsResponse.data.services,
          cmsResponse.data.title
        );
        return { services };
      }),
  ]);

  return {
    props: {
      ...translations,
      session,
      ...cmsResult,
    },
  };
};

export default HomePage;
