import { createCapability, currentTimeContextSetup, z } from '@bitlerjs/core';

import { Calendars } from '../services/calendar.js';
import { eventSchema, parseEvents } from '../utils/utils.parser.js';

const getEventsCapability = createCapability({
  kind: 'calendar.get-events',
  name: 'Get Events',
  group: 'Calendar',
  description: 'Get events from calendars',
  setup: [currentTimeContextSetup],
  input: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
  }),
  output: z.object({
    events: z.array(eventSchema),
  }),
  handler: async ({ container, input }) => {
    const calendarServices = container.get(Calendars);
    const from = input.from ? new Date(input.from) : new Date();
    const to = input.to ? new Date(input.to) : new Date(new Date().setDate(new Date().getDate() + 1));
    const objs = await calendarServices.getEvents(from, to);
    const events = parseEvents({
      objs,
      from,
      to,
    });
    return {
      events,
    };
  },
});

export { getEventsCapability };
