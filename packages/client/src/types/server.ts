type ServerSchema = {
  capabilities: Record<
    string,
    {
      input: any;
      output: any;
    }
  >;
  actionRequests: Record<string, any>;
  events: Record<
    string,
    {
      input: any;
      output: any;
    }
  >;
};

export { type ServerSchema };
