import React from 'react';
import * as yup from 'yup';
import { WizardScreenRenderProps } from 'components/SelfService/types/types';
import { Text } from 'components/Text/text';

export const tempEmptyScreenSchema = yup.object().shape({});

type Props = WizardScreenRenderProps & {
  title: string;
  description: string;
};

export const TempEmptyScreen = ({ title, description }: Props) => {
  return (
    <>
      <Text.PageHeading mt={0} mb={30} startSeen>
        {title}
      </Text.PageHeading>
      <Text.TextBlock startSeen>{description}</Text.TextBlock>
    </>
  );
};
