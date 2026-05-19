export interface InternshipApplication {
  id: string;
  user_id: string;
  internshipposition_id: string;
  status: string;
  // include other necessary fields if needed
}

export interface InternshipPosition {
  id: string;
  title_en: string;
  title_fr?: string;
  description_en?: string;
  description_fr?: string;
  // include other necessary fields if needed
}

export interface ApprovedPosition {
  id: string;
  name: string;
}
