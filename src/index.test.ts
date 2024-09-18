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

import { createNanoRPC, createNanoRPCError, createNanoReply } from "./index.js";

console.log(createNanoRPC("add", [1, 2]));
console.log(createNanoRPC("login", { user: "root", passwd: "123456" }));
console.log(createNanoRPC("logout"));
console.log(createNanoReply("123", 200, 3));
console.log(createNanoRPCError("123", 503, -1, "Something error"));
