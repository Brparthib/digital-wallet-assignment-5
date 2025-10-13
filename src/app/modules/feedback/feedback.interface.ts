export interface IFeedback {
  _id?: string;
  userId: string;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  message?: string;
}
