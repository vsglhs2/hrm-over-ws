export function getHeadersRecord(headers: Headers) {
  const record: Record<string, string> = {};

  for (const [header, value] of headers.entries()) {
    record[header] = value;
  }

  return record;
}
