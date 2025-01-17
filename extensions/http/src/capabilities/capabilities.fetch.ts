import { createCapability, z } from '@bitlerjs/core';

const fetchHttpCapability = createCapability({
  kind: 'http.fetch',
  name: 'Fetch',
  group: 'HTTP',
  description: 'Fetches data from a URL',
  disableDiscovery: true,
  input: z.object({
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
    url: z.string().url(),
    headers: z.record(z.string()),
    body: z
      .object({
        contentType: z.string(),
        content: z.string(),
      })
      .optional(),
  }),
  output: z.object({
    response: z.object({
      statusCode: z.number(),
      statusText: z.string().optional(),
      headers: z.record(z.string()),
      body: z.string(),
    }),
  }),
  handler: async ({ input }) => {
    const response = await fetch(input.url, {
      method: input.method,
      headers: input.headers,
      body: input.body?.content,
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      response: {
        statusCode: response.status,
        responseText: response.statusText,
        headers,
        body: await response.text(),
      },
    };
  },
});

export { fetchHttpCapability };
