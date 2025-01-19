import { Capabilities, Events, Session } from '@bitlerjs/core';
class WebSocketClient {
    #options;
    subscriptions = {};
    #session = new Session();
    constructor(options) {
        this.#options = options;
        options.socket.addEventListener('message', this.#onMessage);
        options.socket.addEventListener('close', this.#onClose);
        this.send({ type: 'connected' });
    }
    #onMessage = async ({ data }) => {
        try {
            const { socket } = this.#options;
            const message = JSON.parse(data);
            const reply = (payload, success) => {
                socket.send(JSON.stringify({
                    type: 'reply',
                    id: message.id,
                    success,
                    payload,
                }));
            };
            try {
                switch (message.type) {
                    case 'subscribe': {
                        await this.subscribe(message.payload.kind, message.payload.input, message.payload.id);
                        reply(null, true);
                        break;
                    }
                    case 'unsubscribe': {
                        await this.unsubscribe(message.payload.id);
                        reply(null, true);
                        break;
                    }
                    case 'run-capability': {
                        const result = await this.runCapability(message.payload.kind, message.payload.input);
                        reply(result, true);
                        break;
                    }
                    default: {
                        throw new Error('Unknown message type');
                    }
                }
            }
            catch (error) {
                console.error('Invalid message', data, error);
                socket.send(JSON.stringify({ type: 'error', payload: 'Invalid message' }));
                return;
            }
        }
        catch (error) {
            console.error('Error processing message', error);
        }
    };
    #onClose = () => {
        for (const unsubscribe of Object.values(this.subscriptions)) {
            unsubscribe();
        }
    };
    runCapability = async (kind, input) => {
        const { container } = this.#options;
        const capabilitiesService = container.get(Capabilities);
        const [capability] = capabilitiesService.get([kind]);
        if (!capability) {
            throw new Error(`Capability ${kind} not found`);
        }
        return capabilitiesService.run({
            capability,
            input,
            session: this.#session,
        });
    };
    unsubscribe = async (id) => {
        this.subscriptions[id]?.();
        delete this.subscriptions[id];
    };
    subscribe = async (kind, input, id) => {
        if (this.subscriptions[id]) {
            return;
        }
        const { container } = this.#options;
        const eventsService = container.get(Events);
        const event = eventsService.get(kind);
        if (!event) {
            throw new Error(`Event ${kind} not found`);
        }
        const listener = (value) => {
            this.send({ type: 'event', payload: { kind, value, id } });
        };
        const subscription = eventsService.subscribe(kind, input, listener);
        this.subscriptions[id] = subscription.unsubscribe;
    };
    send(data) {
        this.#options.socket.send(JSON.stringify(data));
    }
}
export { WebSocketClient };
//# sourceMappingURL=websocket.client.js.map