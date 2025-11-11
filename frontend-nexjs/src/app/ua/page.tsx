// app/ua/page.tsx
import { headers } from 'next/headers';
import { userAgent } from 'next/server';

export default async function UATestPage() {
  const h = await headers();
  const ua = userAgent({ headers: h });
  const rawUA = h.get('user-agent') ?? 'N/A';
  const ip =
    (h.get('x-forwarded-for') || '')
      .split(',')[0]
      ?.trim() || 'N/A';

  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>User-Agent Test</h1>
      <pre>
        {JSON.stringify(
          {
            browser: ua.browser,       // { name, version }
            os: ua.os,                 // { name, version }
            device: ua.device,         // { type, model, vendor }
            isBot: ua.isBot,
            ip,
            rawUA,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}
