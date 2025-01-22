import { createConfigItem, z } from '@bitlerjs/core';
import { createDAVClient } from 'tsdav';

const calendarConfig = createConfigItem({
  kind: 'calendars',
  name: 'Calendars',
  group: 'Integrations',
  description: 'Configure calendars',
  schema: z.object({
    caldav: z.array(
      z.object({
        url: z.string(),
        credentials: z.object({
          username: z.string(),
          password: z.string(),
        }),
      }),
    ),
  }),
  validate: async ({ input }) => {
    await Promise.all(
      input.caldav.map(async (cal) => {
        const account = await createDAVClient({
          serverUrl: cal.url,
          defaultAccountType: 'caldav',
          credentials: cal.credentials,
          authMethod: 'Basic',
        });
        await account.fetchCalendars({});
      }),
    );
  },
});

export { calendarConfig };
