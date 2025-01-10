type ServerSchema = {
  capabilities: {
    [kind: string]: {
      input: any;
      output: any;
    }
  };
  actionRequests: {
    [kind: string]: any;
  };
  events: {
    [kind: string]: {
      input: any;
      output: any;
    }
  };
}

export {
  type ServerSchema,
}
