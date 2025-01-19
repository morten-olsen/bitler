import { Container, Session } from '@bitlerjs/core';
import { AuthOptions } from '../server.js';
type WebSocketClientOptions = {
    container: Container;
    socket: WebSocket;
    session: Session;
};
type SetupOptions = {
    container: Container;
    socket: WebSocket;
    auth?: (auth: AuthOptions) => Promise<void>;
};
declare class WebSocketClient {
    #private;
    subscriptions: Record<string, () => void>;
    constructor(options: WebSocketClientOptions);
    runCapability: (kind: string, input: unknown) => Promise<any>;
    unsubscribe: (id: string) => Promise<void>;
    subscribe: (kind: string, input: unknown, id: string) => Promise<void>;
    send(data: unknown): void;
    static setup: (options: SetupOptions) => Promise<WebSocketClient>;
}
export { WebSocketClient };
//# sourceMappingURL=websocket.client.d.ts.map