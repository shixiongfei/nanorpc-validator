/*
 * index.ts
 *
 * Copyright (c) 2024 Xiongfei Shi
 *
 * Author: Xiongfei Shi <xiongfei.shi(a)icloud.com>
 * License: Apache-2.0
 *
 * https://github.com/shixiongfei/nanorpc-validator
 */

import Ajv, { ValidateFunction } from "ajv";
import { ulid } from "ulid";

export type NanoRPC<P extends Array<unknown>> = {
  id: string;
  method: string;
  arguments: P;
  timestamp: number;
};

export type NanoReply<T> = {
  id: string;
  code: number;
  message: string;
  value?: T;
  timestamp: number;
};

export type SchemaValidator<T> = ValidateFunction<T>;

export class NanoValidator {
  private readonly ajv: Ajv;
  private readonly validators: { [method: string]: SchemaValidator<unknown> };

  constructor() {
    this.ajv = new Ajv();
    this.validators = {};
  }

  getValidator<T>(method: string) {
    return method in this.validators
      ? (this.validators[method] as SchemaValidator<T>)
      : undefined;
  }

  addValidator<T>(method: string, validator: SchemaValidator<T>) {
    if (method in this.validators) {
      throw new Error(`${method} validator already registered`);
    }

    this.validators[method] = validator;
    return this;
  }

  addAjvSchemas(schemas: object | object[]) {
    this.ajv.addSchema(schemas);
    return this;
  }

  addAjvSchema<T>(method: string, schema: string) {
    const validator = this.ajv.getSchema<T>(`#/definitions/${schema}`);

    if (!validator) {
      throw new Error(`Missing Ajv Schema ${schema}`);
    }

    return this.addValidator<T>(method, validator);
  }
}

export const createNanoValidator = () => new NanoValidator();

export const createNanoRPC = <P extends Array<unknown>>(
  method: string,
  args: P,
): NanoRPC<P> => ({
  id: ulid(),
  method,
  arguments: args,
  timestamp: Date.now(),
});

export const createNanoReply = <T>(
  id: string,
  code: number,
  message: string,
  value?: T,
): NanoReply<T> =>
  code === 0
    ? { id, code, message, value, timestamp: Date.now() }
    : { id, code, message, timestamp: Date.now() };
