/*
 * index.test.ts
 *
 * Copyright (c) 2024 Xiongfei Shi
 *
 * Author: Xiongfei Shi <xiongfei.shi(a)icloud.com>
 * License: Apache-2.0
 *
 * https://github.com/shixiongfei/nanorpc-validator
 */

import { createNanoRPC, createNanoReply } from "./index.js";

console.log(createNanoRPC("add", [1, 2]));
console.log(createNanoReply("123", 0, "OK", 3));
