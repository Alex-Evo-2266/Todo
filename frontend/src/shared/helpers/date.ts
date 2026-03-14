export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function combineToDate(dateStr: string, timeStr?:string) {
  // Разбираем дату "2026-03-20" -> [2026, 3, 20]
  const [year, month, day] = dateStr.split('-').map(Number);
  if(timeStr)
  {
    // Разбираем время "06:40" -> [6, 40]
    const [hours, minutes] = timeStr.split(':').map(Number);

    // Создаём объект Date (месяц передаётся с индексом 0)
    return new Date(year, month - 1, day, hours, minutes);
  }
    return new Date(year, month - 1, day);
  
}