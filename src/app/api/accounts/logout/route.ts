export const POST = async () => {
    return new Response(
        JSON.stringify({ message: 'Logged Out' }),
        {
            status: 200,
            headers: {
                'Set-Cookie': 'auth=; HttpOnly; Path=/; Max-Age=0',
                'Content-Type': 'application/json'
            }
        }
    )
}
