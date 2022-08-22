import { SchoolItem } from 'types/cmsPage';
import { getSchoolSeason } from 'utils/helpers';

export type School = {
  name: string;
  id: string;
  classes: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  leisureCenter: {
    name: string;
  };
  term: string;
  description: string;
};

export const getRequestedSchool = (
  requestedSchoolName: string | undefined,
  schools: SchoolItem[]
): School | null => {
  if (requestedSchoolName) {
    const reqSchool = schools.find(
      (r) => r.title.toLowerCase() === requestedSchoolName.toLowerCase()
    );
    if (reqSchool) {
      return {
        name: reqSchool.title,
        id: reqSchool.school_id,
        classes: reqSchool.classes,
        image: {
          url: reqSchool.image.url,
          width: 583,
          height: 280,
        },
        term: getSchoolSeason('current'),
        leisureCenter: {
          name: reqSchool.leisure_center_name,
        },
        description: reqSchool.leisure_center_description,
      };
    }
  }
  return null;
};
