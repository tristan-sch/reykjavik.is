import * as yup from 'yup';

export const photoConsentSchema = yup.object().shape({
  photoConsent: yup.string().required('Þarf að velja').default(''),
  publicationConsent: yup.string().required('Þarf að velja').default(''),
});
