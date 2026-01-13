export type Gender = 'male' | 'female' | 'other'
export type UserRole = 'admin' | 'employee' | 'trainee'

export interface User {
  id: string
  first_name: string
  last_name: string
  full_name: string
  dob: string
  address: string
  gender: Gender
  nationality: string
  is_suspended: boolean
  role: UserRole
  email: string
  username: string
  phone_number: string
  created_at: string
  updated_at?: string
}

export interface PersonalInformation {
  id: string
  user_id: string
  professtional_photo: string | null
  nationality_card: string | null
  family_book: string | null
  birth_certificate: string | null
  degreee_certificate: string | null
  social_media: string | null
  created_at: string
  updated_at?: string
}

export interface EmergencyContact {
  id: string
  user_id: string
  contact_first_name: string
  contact_last_name: string
  contact_relationship: string
  contact_phone_number: string
  contact_address: string
  contact_social_media: string | null
  created_at: string
  updated_at?: string
}

export interface CreateUserPayload {
  first_name: string
  last_name: string
  dob: string
  address: string
  gender: Gender
  nationality: string
  email: string
  username: string
  phone_number: string
  password: string
  password_confirmation: string
  role: UserRole
  contact_first_name: string
  contact_last_name: string
  contact_relationship: string
  contact_phone_number: string
  contact_address: string
  contact_social_media?: string
  nationality_card?: File
  family_book?: File
  birth_certificate?: File
  degreee_certificate?: File
  professtional_photo?: File
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  // All fields are optional for updates
}
