export function generateDateExpire() {
  const currentDate = new Date();
  const dateExp = new Date(currentDate.getTime() + 4 * 60 * 60 * 10000);
  return dateExp;
}

export function validateIfExpired(dateExpire: Date): boolean {
  const currentDate = new Date();
  return dateExpire.getTime() <= currentDate.getTime();
}
