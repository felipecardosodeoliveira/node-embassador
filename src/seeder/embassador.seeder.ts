import { AppDataSource } from "..";

import { User } from "../entity/user.entity";

AppDataSource
    .getRepository(User)
