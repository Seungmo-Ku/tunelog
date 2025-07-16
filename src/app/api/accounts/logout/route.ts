export const POST = async () => {
    const response = new Response(JSON.stringify({ message: 'Logged Out' }), { status: 200 })
    response.headers.set('Set-Cookie', 'auth=; HttpOnly; Path=/; Max-Age=0') // Clear the auth cookie
    return response
}