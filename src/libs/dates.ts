export function dateKeysFromRange(from: Date, to: Date): string[] {
  const dayMiliseconds = 24 * 60 * 60 * 1000;
  const totalDays = Math.abs(Math.ceil((to.getTime() - from.getTime()) / dayMiliseconds));

  const dateKeys = [];

  for (let i = 0; i <= totalDays; i++) {
    const date = new Date(from.getTime() + dayMiliseconds * i);
    const [key] = date.toISOString().split('T');
    dateKeys.push(key);
  }

  return dateKeys;
}
