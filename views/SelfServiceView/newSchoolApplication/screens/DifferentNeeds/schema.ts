import * as yup from 'yup';

export const differentNeedsSchema = yup.object().shape({
  languages: yup
    .array()
    .of(yup.string())
    .required('schoolEnrollment:steps.languages.validation.languagesRequired')
    .min(1, 'schoolEnrollment:steps.languages.validation.languagesRequired')
    .default([]),
  isRequestingDiscussionWithTeacher: yup.boolean().default(false),
});
