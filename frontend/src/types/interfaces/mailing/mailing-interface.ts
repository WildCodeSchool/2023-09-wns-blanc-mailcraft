export interface contactInputs {
  firstname: string;
  lastname?: string;
  email: string;
  profilepic?: string;
}

export interface contactData {
  id: number;
  firstname: string;
  lastname?: string;
  email: string;
  profilepic?: string;
  userId: number;
}
