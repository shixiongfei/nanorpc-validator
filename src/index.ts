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

export type NanoRPC<T extends object> = {
  id: string;
  method: string;
  params?: T;
};

export type NanoReply<T> = {
  id: string;
  status: number;
  error?: { code: number; message: string };
  result?: T;
};

export class NanoRPCError extends Error {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = "NanoRPCError";
    this.code = code;
  }
}

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

export const createNanoRPC = <T extends object>(
  method: string,
  params?: T,
): NanoRPC<T> =>
  params ? { id: ulid(), method, params } : { id: ulid(), method };

export const createNanoReply = <T>(
  id: string,
  status: number,
  result: T,
): NanoReply<T> => ({ id, status, result });

export const createNanoRPCError = (
  id: string,
  status: number,
  code: number,
  message: string,
): NanoReply<never> => ({ id, status, error: { code, message } });
