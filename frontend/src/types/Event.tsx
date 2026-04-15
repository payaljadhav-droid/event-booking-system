export type Event = {
  _id: string;
  title: string;
  date_time: string;
  image_url: string;
  location: string;
  description?: string;
  time?: string;
  available_tickets: number;
};