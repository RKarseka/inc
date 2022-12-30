import bcrypt from "bcrypt";

export const bcryptService = {
  async compare(password: string, userPasswordHash: string) {
    return await bcrypt.compare(password, userPasswordHash)
  },

  async makePasswordHash(password: string) {
    const passwordSalt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, passwordSalt)
  }
}