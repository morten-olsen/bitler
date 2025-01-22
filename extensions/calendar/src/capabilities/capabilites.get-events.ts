import { createCapability, z } from '@bitlerjs/core';
import ical from 'node-ical';

import { Calendars } from '../services/calendar.js';

const getEventsCapability = createCapability({
  kind: 'calendar.get-events',
  name: 'Get Events',
  group: 'Calendar',
  description: 'Get events from calendars',
  input: z.object({}),
  output: z.any(),
  handler: async ({ container }) => {
    const calendarServices = container.get(Calendars);
    const events = await calendarServices.getEvents(
      new Date(),
      // new week
      new Date(new Date().setDate(new Date().getDate() + 7)),
    );
    const parsedEvents = events.map((e) => ical.parseICS(e.data));
    return { events: parsedEvents };
  },
});

export { getEventsCapability };
