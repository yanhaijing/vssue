import format from 'date-fns/esm/format';
import parseISO from 'date-fns/esm/parseISO';

export const formatDateTime = (str: string): string => {
  const dateTime = format(parseISO(str), 'yyyy-MM-dd HH:mm:ss');
  return dateTime;
};
