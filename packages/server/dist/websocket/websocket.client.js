import { Capabilities, Events, Session } from '@bitlerjs/core';
class WebSocketClient {
    #options;
    subscriptions = {};
    #session = new Session();
    constructor(options) {
        this.#options = options;
        options.socket.addEventListener('message', this.#onMessage);
        options.socket.addEventListener('close', this.#onClose);
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
                        if (!this.#session) {
                            throw new Error('Not authenticated');
                        }
                        await this.subscribe(message.payload.kind, message.payload.input, message.payload.id);
                        reply(null, true);
                        break;
                    }
                    case 'unsubscribe': {
                        if (!this.#session) {
                            throw new Error('Not authenticated');
                        }
                        await this.unsubscribe(message.payload.id);
                        reply(null, true);
                        break;
                    }
                    case 'run-capability': {
                        if (!this.#session) {
                            throw new Error('Not authenticated');
                        }
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
                reply({
                    message: error instanceof Error ? error.message : String(error),
                }, false);
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
        return await capabilitiesService.run({
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
        const subscription = eventsService.subscribe(event, input, listener);
        this.subscriptions[id] = subscription.unsubscribe;
    };
    send(data) {
        this.#options.socket.send(JSON.stringify(data));
    }
    static setup = (options) => new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            options.socket.close();
            reject(new Error('Timeout'));
            options.socket.removeEventListener('message', authHandler);
            options.socket.removeEventListener('message', authHandler);
        }, 3000);
        const disconnectHandler = () => {
            clearTimeout(timeout);
            options.socket.removeEventListener('message', authHandler);
            reject(new Error('Disconnected'));
        };
        const authHandler = async (message) => {
            try {
                const { type, payload } = JSON.parse(message.data);
                const session = new Session();
                if (type !== 'authenticate') {
                    throw new Error('Invalid message');
                }
                await options.auth?.({
                    container: options.container,
                    session,
                    request: {
                        headers: {
                            authorization: `Bearer ${payload.token}`,
                        },
                    },
                });
                options.socket.send(JSON.stringify({ type: 'authenticated' }));
                resolve(new WebSocketClient({ ...options, session }));
            }
            catch (error) {
                reject(error);
                options.socket.send(JSON.stringify({ type: 'error', payload: 'Invalid message' }));
            }
            finally {
                clearTimeout(timeout);
                options.socket.removeEventListener('message', authHandler);
                options.socket.removeEventListener('close', disconnectHandler);
            }
        };
        options.socket.addEventListener('message', authHandler);
        options.socket.addEventListener('close', disconnectHandler);
    });
}
export { WebSocketClient };
//# sourceMappingURL=websocket.client.js.map