import { ActionRequests, Capabilities, ContextItems, createSchemas, Events, schemasSchema } from '@bitlerjs/core';
const schemasPlugin = async (app) => {
    app.route({
        method: 'get',
        url: '',
        schema: {
            tags: ['schemas'],
            operationId: 'schemas.list',
            response: {
                200: schemasSchema,
            },
        },
        handler: async (request, reply) => {
            const { container } = request;
            const capabilitesService = container.get(Capabilities);
            const actionRequestsService = container.get(ActionRequests);
            const contextItemsService = container.get(ContextItems);
            const eventsService = container.get(Events);
            const capabilities = capabilitesService.list();
            const actionRequests = actionRequestsService.list();
            const contextItems = contextItemsService.list();
            const events = eventsService.list();
            const schemas = createSchemas({
                capabilities,
                actionRequests,
                contextItems,
                events,
            });
            reply.send(schemas);
        },
    });
};
export { schemasPlugin };
//# sourceMappingURL=routes.schema.js.map