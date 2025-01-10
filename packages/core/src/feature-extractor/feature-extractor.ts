import { cos_sim, FeatureExtractionPipeline, pipeline } from '@huggingface/transformers';
import { toSql } from 'pgvector';

class Vector {
  #value: any;
  #dimentions: number;

  constructor(value: any, dimentions: number) {
    this.#value = value;
    this.#dimentions = dimentions;
  }

  public get value() {
    return this.#value;
  }

  public set value(value: any) {
    this.#value = value;
  }

  public get dimentions() {
    return this.#dimentions;
  }

  public toSql = () => {
    return toSql(this.#value);
  }

  public distanceTo = (other: Vector) => {
    return cos_sim(this.#value, other.value);
  }
}

class FeatureExtractor {
  #extratorPromise?: Promise<FeatureExtractionPipeline>;

  #setupExctractor = async () => {
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'q8',
    });
    return extractor;
  };

  #getExtractor = async () => {
    if (!this.#extratorPromise) {
      this.#extratorPromise = this.#setupExctractor();
    }
    return this.#extratorPromise;
  };

  public extract = async (input: string[]) => {
    const extractor = await this.#getExtractor();
    const output = await extractor(input, { pooling: 'cls' });
    return output.tolist().map((v: any) => new Vector(v, FeatureExtractor.dimentions));
  };

  public get dimentions() {
    return FeatureExtractor.dimentions;
  }

  public get FieldType() {
    return FeatureExtractor.FieldType;
  }

  static get dimentions() {
    return 384;
  }

  static get FieldType() {
    return `vector(FeatureExtractor, ${FeatureExtractor.dimentions})`;
  }
}

export { FeatureExtractor, Vector }
