class Agency {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: number;
  subscription: Date;

  constructor(
    id: number,
    name: string,
    email: string,
    address: string,
    phone: number,
    subscription: Date
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.subscription = subscription;
  }
}
export default Agency;
