import * as yup from 'yup';

const currentIcelandicSchoolSchema = yup.object().shape({
  school: yup.string().required('Þarf að fylla út').default(''),
  district: yup.string().required('Þarf að fylla út').default(''),
});

const requestedSchoolSchema = yup.object().shape({
  school: yup.string().required('Þarf að velja skóla').default(''),
  district: yup.string().required('Þarf að velja hverfi').default(undefined),
});

export const schoolSchema = yup.object().shape({
  currentSchoolLocation: yup
    .string()
    .required('Þarf að velja núverandi skóla')
    .default(''),
  currentIcelandicSchool: currentIcelandicSchoolSchema
    .when('currentSchoolLocation', {
      is: (currentSchoolLocation: string) => currentSchoolLocation === 'iceland',
      then: currentIcelandicSchoolSchema.required('This field is required'),
    })
    .default(undefined),
  requestedSchool: requestedSchoolSchema,
  selectedSchoolYear: yup.string().required('Þarf að velja').default(''),
  currentSchoolSeasonBeginDate: yup.string().default(undefined),
  reasonForSchoolChange: yup.string().required('Þarf að fylla út').default(''),
});

export type RequestSchoolSchema = yup.InferType<typeof requestedSchoolSchema>;
