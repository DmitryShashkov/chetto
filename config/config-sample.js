module.exports = {
    server: {
        port: 8000,
        useHTTPS: false
    },
    staticDir: 'public',
    certificates: {
        key: '',
        crt: '',
        ca: ''
    },
    google: {
        web: {
            clientID: '',
            projectID: '',
            authURI: 'https://accounts.google.com/o/oauth2/auth',
            tokenURI: 'https://accounts.google.com/o/oauth2/token',
            authProviderX509CertURL: 'https://www.googleapis.com/oauth2/v1/certs',
            clientSecret: '',
            redirectURIs: [
                'http://localhost:8000/auth/google/callback'
            ],
            javascriptOrigins: [
                'http://localhost:8000'
            ]
        }
    }
};
