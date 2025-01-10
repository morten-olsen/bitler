import { z } from "zod";

const DEFAULT_MODEL = 'openai-gpt-4o-mini';

const modelSchema = z.object({
  id: z.string(),
  name: z.string(),
  api: z.string().optional(),
  token: z.string(),
  modelName: z.string(),
});

type Model = z.infer<typeof modelSchema>;

class Models {
  #models: Model[] = [{
    id: 'openai-gpt-4o-mini',
    token: process.env.OPENAI_API_KEY!,
    name: 'OpenAI GPT-4o Mini',
    modelName: 'gpt-4o-mini',
  }, {
    id: 'ollama-llama-3.2-1b',
    token: 'ollama',
    name: 'LLama 3.2 1b',
    api: 'http://localhost:11434/v1',
    modelName: 'llama3.2:1b',
  }, {
    id: 'ollama-llama-3.1-8b',
    token: 'ollama',
    name: 'LLama 3.1 8b',
    api: 'http://localhost:11434/v1',
    modelName: 'llama3.1:8b',
  }];

  public get default() {
    return this.#models.find((m) => m.id === DEFAULT_MODEL)!;
  }

  public get models() {
    return this.#models;
  }

  public get(id?: string) {
    if (!id) {
      return this.default;
    }
    const model = this.#models.find((m) => m.id === id);
    if (!model) {
      throw new Error(`Model ${id} not found`);
    }
    return model;
  }

  public add(model: Model) {
    this.#models.push(model);
  }

  public remove(id: string) {
    this.#models = this.#models.filter((m) => m.id !== id);
  }
}

export { Models };
