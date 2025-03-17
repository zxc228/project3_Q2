const jwt = require('jsonwebtoken');

const user = { 
    id: 1, 
    username: 'john mary', 
    role: 1,
} 

// Create a JWT
const token = jwt.sign(user, 'your-very-secret-key', { expiresIn: '1h' });  // Expires in 1 hour
console.log(`JWT: ${token}`);  // This is your JWT

/*
    ON THE CLIENT SIDE
    When a client (like a browser or mobile app) sends the JWT back to the server 
    (usually in the Authorization header), you can verify it to ensure it's valid.

    the server signs the jwt, sends it to the client who just holds it.
    and the server retrieves this jwt, verifies it and allows that client to do shit
 */

try {
  const decoded = jwt.verify(token, 'your-very-secret-key');
  console.log(decoded);  // This is the decoded payload
} catch (err) {
  console.error('Token verification failed', err);
}

// these fields are in Unix timestamp (seconds since the Unix epoch, January 1, 1970).
// iat: (issued at)
// exp: (expiration)

/*
    WHERE THE FUCK TO STORE JWTS ON BROWSER:
        LOCALSTORAGE: ACCESSIBLE THROUGH JS
        SESSIONSTORAGE: LOST ON TAB CLOSED ... ACCESSIBLE THROUGH JS
        COOKIES: MOST SECURE, store on persistent cookies

    // Set cookie with HttpOnly and Secure flags
    // avoid CSRF attacks with SameSite=Strict flag
    document.cookie = "jwt=your_jwt_token_here; Secure; HttpOnly; SameSite=Strict; path=/";

    document.cookie = "jwt=xxx.yyy.zzz; path=/; Secure; HttpOnly; SameSite=Strict;"
*/

