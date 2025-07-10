import bcrypt from 'bcrypt'


const saltRounds = 10

export const hashPassword = async (password: string): Promise<string> => {
    const hash = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(password, hash)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash)
}