import { User } from "./user";

export type Product = {
  name: string;
  id: string;
  description: string;
  price: number;
  image: string;
  onwer: User
}