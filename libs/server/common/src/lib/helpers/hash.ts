import * as bcrypt from 'bcrypt';

export async function hashPassword(rawPassword: string): Promise<string> {
  return bcrypt.hash(rawPassword, Number(process.env.SALT_ROUNDS));
}

export async function compareHashedPassword(
  rawPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(rawPassword, hashedPassword);
}
