import { Container } from '@bitlerjs/core';
import { AuthOptions } from '../server.js';
type WebSocketClientOptions = {
    container: Container;
    socket: WebSocket;
    auth?: (options: AuthOptions) => Promise<void>;
};
declare class WebSocketClient {
    #private;
    subscriptions: Record<string, () => void>;
    constructor(options: WebSocketClientOptions);
    runCapability: (kind: string, input: unknown) => Promise<any>;
    unsubscribe: (id: string) => Promise<void>;
    subscribe: (kind: string, input: unknown, id: string) => Promise<void>;
    send(data: unknown): void;
}
export { WebSocketClient };
//# sourceMappingURL=websocket.client.d.ts.map