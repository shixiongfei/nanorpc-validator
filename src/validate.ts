/*
 * validate.ts
 *
 * Copyright (c) 2024 Xiongfei Shi
 *
 * Author: Xiongfei Shi <xiongfei.shi(a)icloud.com>
 * License: Apache-2.0
 *
 * https://github.com/shixiongfei/nanorpc-validator
 */

import fs from "node:fs";
import Ajv from "ajv";

const readJSONObject = <T>(filename: string) =>
  JSON.parse(fs.readFileSync(filename, "utf8")) as T;

const ajv = new Ajv();

export const getAjvSchema = <T>(filename: string, schema: string) => {
  const validate = ajv.getSchema<T>(`#/definitions/${schema}`);
  return validate
    ? validate
    : ajv
        .addSchema(readJSONObject(filename))
        .getSchema<T>(`#/definitions/${schema}`);
};

export type SchemaValidator<T> = NonNullable<
  ReturnType<typeof getAjvSchema<T>>
>;
