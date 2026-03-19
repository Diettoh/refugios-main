let responses = [];
let calls = [];

export function setupMock(nextResponses = []) {
  responses = Array.isArray(nextResponses) ? nextResponses : [];
  calls = [];
}

export function resetMock() {
  responses = [];
  calls = [];
}

export function getCalls() {
  return [...calls];
}

export async function mockQuery(text, params) {
  calls.push({ text, params });
  const match = responses.find((r) => text.includes(r.match));
  if (match) return match.result;
  return { rows: [], rowCount: 0 };
}

