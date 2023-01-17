/* eslint-disable import/prefer-default-export */
export function studentCodeToYear(studentCode: string): number {
  const currentYear = Number(
    (Number(new Date().getFullYear()) + 543).toString().slice(-2)
  );

  const studentYear = currentYear - Number(studentCode.slice(0, 2));

  return studentYear;
}
