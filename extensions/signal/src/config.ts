const host = process.env.SIGNAL_HOST!;
const secure = process.env.SIGNAL_SECURE === 'true';

export { host, secure };
