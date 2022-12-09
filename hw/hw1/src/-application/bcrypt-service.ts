import bcrypt from "bcrypt";

export const bcryptService = {
  async compare(password: string, userPasswordHash: string) {
    return await bcrypt.compare(password, userPasswordHash)
  }
}