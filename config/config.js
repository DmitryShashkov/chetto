module.exports = {
    server: {
        port: process.env.PORT || 8000,
        useHTTPS: process.env.USE_HTTPS || false
    },
    staticDir: 'public',
    google: {
        web: {
            clientID: process.env.GOOGLE_CLIENT_ID,
            projectID: process.env.GOOGLE_PROJECT_ID,
            authURI: 'https://accounts.google.com/o/oauth2/auth',
            tokenURI: 'https://accounts.google.com/o/oauth2/token',
            authProviderX509CertURL: 'https://www.googleapis.com/oauth2/v1/certs',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectURIs: [
                'http://localhost:8000/auth/google/callback',
                'https://chetto.herokuapp.com/auth/google/callback'
            ],
            javascriptOrigins: [
                'http://localhost:8000',
                'https://chetto.herokuapp.com'
            ]
        }
    }
};
