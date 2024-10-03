export interface UserData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface UserProfileData {
  email: string;
  bio: string;
}

export interface UserInterest {
  interest_id: number;
  interest_name: string;
  category_name: string;
}

export interface InterestCategory {
  id: number;
  name: string;
}

export interface Interest {
  id: number;
  name: string;
  category: number;
  category_name: string;
}

export interface UpdatedUserInterest {
  interest_id: number;
}
