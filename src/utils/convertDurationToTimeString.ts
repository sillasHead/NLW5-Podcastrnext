export function convertDurationToTimeString(duration: number): string {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0')) //§ toda vez que tiver apenas um digito, o 0 sera adicionado para ter 2 digitos
    .join(':');

  return timeString;
}
