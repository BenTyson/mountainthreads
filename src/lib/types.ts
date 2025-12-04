// Shared types used across the application

// Base group type with common fields
export interface Group {
  id: string;
  name: string;
  slug: string;
  leaderName: string | null;
  leaderEmail: string | null;
  expectedSize: number | null;
  rentalStartDate: Date | string | null;
  rentalEndDate: Date | string | null;
  skiResort: string | null;
  paid: boolean;
  pickedUp: boolean;
  returned: boolean;
  archived: boolean;
  notes: string | null;
  emails: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Group with submission count (used in lists)
export interface GroupWithCount extends Group {
  _count: {
    submissions: number;
  };
}

// Crew type - a sub-group within a group (e.g., "Smith Family")
export interface Crew {
  id: string;
  groupId: string;
  name: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Crew with submissions
export interface CrewWithSubmissions extends Crew {
  submissions: FormSubmission[];
}

// Form submission type
export interface FormSubmission {
  id: string;
  groupId: string;
  crewId: string | null;
  crew?: Crew | null;
  email: string | null;
  isLeader: boolean;
  isCrewLeader: boolean;
  paysSeparately: boolean;
  data: unknown;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Group with full submissions (used in detail view)
export interface GroupWithSubmissions extends Group {
  submissions: FormSubmission[];
  crews?: Crew[];
}
