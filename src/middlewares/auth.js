const config = require('config');
const jwt = require('jsonwebtoken');
module.exports = async function(req){
    // const devToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZUlkIjoiNWViNTMwNmE5NWIzYjUwMzcwZDI4ODA0IiwidXNlcklkIjoiNWViNTMwNmE5NWIzYjUwMzcwZDI4ODA1In0.HD--9IG_U0NPfySiBgoMaiATqC_CfNKciywzzNzu3Xg';
    const token = req.headers['x-auth-token'];
    const key = config.get('jwt.key');
    if(!key) return new Response('Forbidden', 403);
    if(!token) return new Response('Access denied.', 401);
    try{
        const decoded = jwt.verify(token, key);
        req.session = {
            user: { _id: decoded.userId },
        }
        return new Response();
    }catch(ex){
        return new Response('Invalid token', 400);
    }
}