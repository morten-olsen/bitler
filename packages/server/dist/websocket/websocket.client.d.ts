import { Container } from '@bitlerjs/core';
type WebSocketClientOptions = {
    container: Container;
    socket: WebSocket;
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