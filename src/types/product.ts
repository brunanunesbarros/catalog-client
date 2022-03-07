import { User } from "./user";

export type Product = {
  name: string;
  id: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  onwer: User
}