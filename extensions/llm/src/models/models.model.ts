type Model = {
  kind: string;
  name: string;
  provider: string;
  modelName: string;
  url?: string;
  apiKey: string;
};

const createModel = (model: Model) => model;

export { type Model, createModel };
