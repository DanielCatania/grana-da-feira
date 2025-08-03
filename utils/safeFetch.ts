export default async function safeFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, init);

  // blocked
  if (res.status === 429) {
    let reason = "temporary";
    try {
      const data = await res.json();
      if (data.reason) reason = data.reason;
    } catch {}

    window.location.href = `/blocked?reason=${reason}`;
  }

  return res;
}
