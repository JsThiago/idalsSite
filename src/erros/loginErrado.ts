export default class LoginErrado extends Error {
  constructor(message: string) {
    super(message);
  }
}
